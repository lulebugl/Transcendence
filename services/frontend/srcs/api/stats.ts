import { apiRequest } from "./api";
import { Rank } from "@/types";

interface UserStatsResponse {
  user_id: number;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  games_won: number;
  games_lost: number;
  best_win_streak: number;
  tournaments_won: number;
}

interface LeaderboardEntryResponse {
  id: number;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  games_won: number;
  games_lost: number;
}

const getRank = (level?: number): Rank => {
  if (level >= 30) return "Platinum";
  if (level >= 20) return "Diamond";
  if (level >= 10) return "Gold";
  return "Silver";
};

const getWinrate = (won: number, lost: number): number => {
  const total = won + lost;
  return total == 0 ? 0 : (won / total) * 100;
};

export interface UserStats extends UserStatsResponse {
  rank: Rank;
  winrate: number;
}

const enrichUserStats = (data: UserStatsResponse): UserStats => ({
  ...data,
  rank: getRank(data.level),
  winrate: getWinrate(data.games_won, data.games_lost),
});

const enrichLeaderboardEntry = (data: LeaderboardEntryResponse) => ({
  ...data,
  rank: getRank(data.level),
  winrate: getWinrate(data.games_won, data.games_lost),
});

export const UserStatsApi = {
  getUserStats: async (id: number) => {
    const data = await apiRequest<UserStatsResponse>(`/api/users/${id}/stats`, {
      method: "GET",
    });
    return enrichUserStats(data);
  },

  getLeaderboard: async (offset = 0, limit = 10) => {
    const data = await apiRequest<LeaderboardEntryResponse[]>(
      `/api/leaderboard?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
      }
    );

    return data.map(enrichLeaderboardEntry);
  },
};
