import { apiRequest } from "./api";
import { Rank } from "@/types";

interface LeaderboardEntryResponse {
  id: number;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  games_won: number;
  games_lost: number;
}

export type LeaderboardPlayer = LeaderboardEntryResponse & {
  rank: Rank;
  winrate: number;
};

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

export const UserStatsApi = {
//   getUserStats: async (id: number): Promise<UserStats> => {
//     const data = await apiRequest<UserStatsResponse>(`/api/users/${id}/stats`, {
//       method: "GET",
//     });
//     return { ...data, rank: getRank(data?.level) };
//   },

  getLeaderboard: async (
    offset = 0 as number,
    limit = 10 as number
  ): Promise<LeaderboardPlayer[]> => {
    const data = await apiRequest<LeaderboardEntryResponse[]>(
      `/api/leaderboard?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
      }
    );

    const leaderboard = data.map((item) => ({
      ...item,
      rank: getRank(item?.level),
      winrate: getWinrate(item.games_won, item.games_lost),
    }));
    return leaderboard;
  },
};
