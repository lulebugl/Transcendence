import { apiRequest } from "./api";

export type Match = {
  id: number;
  playerId1: number;
  playerId2: number;
  player1Name: string;
  player2Name: string;
  player1Avatar: string;
  player2Avatar: string;
  score1: number;
  score2: number;
  expGained1: number;
  expGained2: number;
  timestamp: number;
  winner: number | null;
};

export const matchHistoryApi = {
  getMatchHistory: async (count = 10, offset = 0) => {
    const data = await apiRequest<{ matches: Match[] }>(
      `/api/public/matches?count=${count}&offset=${offset}`,
      {
        method: "GET",
      }
    );
    return data.matches;
  },
  getPlayerMatchHistory: async (playerId: number, count = 10, offset = 0) => {
    const data = await apiRequest<{ matches: Match[] }>(
      `/api/public/matches/player/${playerId}?count=${count}&offset=${offset}`,
      {
        method: "GET",
      }
    );
    return data.matches;
  },
};
