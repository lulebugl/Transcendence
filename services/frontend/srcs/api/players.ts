// api/players.ts
import { apiRequest } from "./api";
import { Rank } from "@/types";
import { AchievementMetadata } from "@/routes/profiles/achievements";
import { getRank } from "@/lib/utils";

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
  getPlayerLevel: async (username: string) => {
    return apiRequest<number>(`/api/users/${username}/level`, {
      method: "GET",
    });
  },
  getPlayerRank: async (username: string) => {
    return apiRequest<Rank>(`/api/users/${username}/rank`, {
      method: "GET",
    });
  },
};
