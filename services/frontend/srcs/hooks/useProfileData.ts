import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useAuth } from "@/hooks/useAuth";
import { playersApi } from "@/api/players";
import { ProfileData, OnlineStatus } from "@/types";
import { useEffect } from "react";
import { toEpochMs } from "@/lib/utils";
import { xpForLevel } from "@/lib/xp";

const FIFTEEN_MINUTES = 1000 * 60 * 15;
const TEN_MINUTES = 1000 * 60 * 10;

export const usePlayerLevel = (username?: string) => {
  const { data: level } = useQuery(() =>
    username ? playersApi.getPlayerLevel(username) : Promise.resolve(null)
  );
  return level;
};

export const getOnlineStatus = (lastCall: number | string | Date | null | undefined): OnlineStatus => {
  const lastCallMs = toEpochMs(lastCall);
  const now = Date.now();
  if (lastCallMs >= now - TEN_MINUTES) return "online";
  if (lastCallMs >= now - FIFTEEN_MINUTES) return "away";
  return "offline";
};

const formatMemberSince = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

// ─── Hook ──────────────────────────────────────────────
export function useProfileData(username?: string) {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const targetUsername = username ?? authUser?.username;

  const {
    data: playerData,
    isLoading: isProfileLoading,
	refetch: refetchProfile,
    error,
  } = useQuery(
    () => (targetUsername ? playersApi.getProfile(targetUsername) : Promise.resolve(null)),
  );

  useEffect(() => {
    if (targetUsername) {
      refetchProfile();
    }
  }, [targetUsername, refetchProfile]);

  const isOwnProfile = authUser?.username === targetUsername;

  const profileData = useMemo((): ProfileData | null => {
    if (!playerData) return null;

	const currentXp = xpForLevel(playerData.level);
    const nextLevelXp = xpForLevel(playerData.level + 1);
    const xpNeededForNextLevel = nextLevelXp - currentXp;

    return {
      id: playerData.userId,
      username: playerData.username,
      avatarUrl: playerData.avatarUrl,
      onlineStatus: getOnlineStatus(playerData.lastCall),
      level: playerData.level,
      xp: playerData.xp,
      rank: playerData.rank,
      memberSince: formatMemberSince(playerData.memberSince),
      nextLevelXp: xpNeededForNextLevel,
      winRate: playerData.winRate,
      gamesWon: playerData.gamesWon,
      gamesLost: playerData.gamesLost,
      bestWinStreak: playerData.bestWinStreak,
      tournamentsWon: playerData.tournamentsWon,
      rankPosition: playerData.globalRank,
    };
  }, [playerData]);

  return {
    profileData,
    isOwnProfile,
    isLoading: isAuthLoading || isProfileLoading,
    error,
  };
}
