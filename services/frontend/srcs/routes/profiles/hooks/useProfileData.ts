import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useAuth } from "@/hooks/useAuth";
import { playersApi } from "@/api/players";
import { ProfileData, OnlineStatus } from "@/types";
import { useEffect } from "react";

const FIFTEEN_MINUTES = 1000 * 60 * 15;
const TEN_MINUTES = 1000 * 60 * 10;
const XP_PER_LEVEL = 1000;

const getOnlineStatus = (lastCall: number): OnlineStatus => {
  const now = Date.now();
  if (lastCall <= now - FIFTEEN_MINUTES) return "offline";
  if (lastCall <= now - TEN_MINUTES) return "away";
  return "online";
};

const formatMemberSince = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

const getNextLevelXp = (level: number): number => {
  return level * XP_PER_LEVEL;
};

// ─── Hook ──────────────────────────────────────────────
export function useProfileData(userId?: number) {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const targetId = userId ?? authUser?.id;

  const {
    data: playerData,
    isLoading: isProfileLoading,
	refetch: refetchProfile,
    error,
  } = useQuery(
    () => (targetId ? playersApi.getProfile(targetId) : Promise.resolve(null)),
  );

  useEffect(() => {
    if (targetId) {
      refetchProfile();
    }
  }, [targetId, refetchProfile]);

  const isOwnProfile = authUser?.id === targetId;

  const profileData = useMemo((): ProfileData | null => {
    if (!playerData) return null;

    return {
      id: playerData.userId,
      username: playerData.username,
      avatarUrl: playerData.avatarUrl,
      onlineStatus: getOnlineStatus(playerData.lastCall),
      level: playerData.level,
      xp: playerData.xp,
      rank: playerData.rank,
      memberSince: formatMemberSince(playerData.memberSince),
      nextLevelXp: getNextLevelXp(playerData.level),
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
