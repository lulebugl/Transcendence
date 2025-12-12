import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useAuth } from "@/hooks/useAuth";
import { playersApi } from "@/api/players";
import { ProfileData, OnlineStatus } from "@/types";
import { useEffect } from "react";

const FIFTEEN_MINUTES = 1000 * 60 * 15;
const TEN_MINUTES = 1000 * 60 * 10;
const XP_PER_LEVEL = 1000;

// TODO: check the bug where when the app starts everyone is online
// TODO: check the bug where when the app starts everyone is online
// TODO: check the bug where when the app starts everyone is online

const toEpochMs = (value: number | string | Date | null | undefined): number => {
  if (!value) return 0;
  // If it's a number less than year 2000 in ms, assume it's in seconds
  if (typeof value === "number" && value < 946684800000) {
    return value * 1000;
  }
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
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

const getNextLevelXp = (level: number): number => {
  return level * XP_PER_LEVEL;
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
