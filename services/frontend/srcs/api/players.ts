// api/players.ts
import { apiRequest } from "./api";
import { Rank } from "@/types";
import { ProfileData } from "@/types";

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
  id: number;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  gamesWon: number;
  gamesLost: number;
}

export type LeaderboardEntry = LeaderboardEntryResponse & {
  rank: Rank;
  winRate: number;
};

// ─── Helpers ───────────────────────────────────────────
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
  getProfile: async (id: number) => {
    const data = await apiRequest<ProfileResponse>(`/api/users/${id}/profile`, {
      method: "GET",
    });
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
};
