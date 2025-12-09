// api/players.ts
import { apiRequest } from "./api";
import { Rank } from "@/types";
import { AchievementMetadata } from "@/routes/profiles/achievements";

interface ProfileResponse {
  userId: number;
  username: string;
  avatarUrl: string | null;
  lastCall: number;
  level: number;
  xp: number;
  gamesWon: number;
  gamesLost: number;
  bestWinStreak: number;
  tournamentsWon: number;
  memberSince: number;
  globalRank: number;
}

interface LeaderboardEntryResponse {
  userId: number;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  gamesWon: number;
  gamesLost: number;
  lastCall: number;
}
  
export type LeaderboardEntry = LeaderboardEntryResponse & {
  rank: Rank;
  winRate: number;
};

// ─── Helpers ───────────────────────────────────────────
const toEpochMs = (
  value: number | string | Date | null | undefined
): number => {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
};

const getRank = (level: number): Rank => {
  if (level >= 30) return "Platinum";
  if (level >= 20) return "Diamond";
  if (level >= 10) return "Gold";
  return "Silver";
};

const getWinrate = (won: number, lost: number): number => {
  const total = won + lost;
  return total === 0 ? 0 : Number(((won / total) * 100).toFixed(1));
};

// ─── API ───────────────────────────────────────────────
export const playersApi = {
  getProfile: async (username: string) => {
    const data = await apiRequest<ProfileResponse>(
      `/api/users/${username}/profile`,
      {
        method: "GET",
      }
    );
    return {
      ...data,
      lastCall: toEpochMs(data.lastCall),
      rank: getRank(data.level),
      winRate: getWinrate(data.gamesWon, data.gamesLost),
    };
  },

  getLeaderboard: async (offset = 0, limit = 10) => {
    const data = await apiRequest<LeaderboardEntryResponse[]>(
      `/api/leaderboard?offset=${offset}&limit=${limit}`,
      { method: "GET" }
    );
    return data.map((entry) => ({
      ...entry,
      rank: getRank(entry.level),
      lastCall: toEpochMs(entry.lastCall),
      winRate: getWinrate(entry.gamesWon, entry.gamesLost),
    }));
  },
  getAchievements: async () => {
    return apiRequest<AchievementMetadata[]>(`/api/achievements`, {
      method: "GET",
    });
  },
  getPlayerAchievements: async (playerId: number) => {
    return apiRequest<string[]>(`/api/users/${playerId}/achievements`, {
      method: "GET",
    });
  },
};
