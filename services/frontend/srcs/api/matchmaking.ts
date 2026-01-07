import { apiRequest } from "./api";

// ─── Types ─────────────────────────────────────────────
export interface JoinQueueResponse {
  status: string;
  position: number;
}

export interface LeaveQueueResponse {
  status: string;
}

export interface MatchmakingStatusResponse {
  status: "matched" | "waiting" | "error";
  matchId?: string;
  queueSize?: number;
  message?: string;
  id?: string;
  wsToken?: string;
}

export interface MatchData {
  matchId: string;
  wsToken: string;
  playerId: string;
}

// ─── API ───────────────────────────────────────────────
export const matchmakingApi = {
  join: async (): Promise<JoinQueueResponse> => {
    return apiRequest<JoinQueueResponse>("/api/matchmaking/join", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  leave: async (): Promise<LeaveQueueResponse> => {
    return apiRequest<LeaveQueueResponse>("/api/matchmaking/leave", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  getStatus: async (): Promise<MatchmakingStatusResponse> => {
    return apiRequest<MatchmakingStatusResponse>("/api/matchmaking/status", {
      method: "GET",
    });
  },
};

