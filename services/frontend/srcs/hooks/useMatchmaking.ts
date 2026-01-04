import { useState, useEffect, useRef, useCallback } from "react";
import { matchmakingApi, MatchData } from "@/api/matchmaking";

export type MatchmakingStatus = "idle" | "searching" | "matched";

const POLLING_INTERVAL = 1000; // every second

export function useMatchmaking() {
  const [status, setStatus] = useState<MatchmakingStatus>("idle");
  const [queueSize, setQueueSize] = useState(0);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const statusRef = useRef(status);
  statusRef.current = status;

  const joinQueue = useCallback(async () => {
    if (statusRef.current !== "idle") return;

    setError(null);
    setStatus("searching");

    try {
      await matchmakingApi.join();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus("idle");
    }
  }, []);

  const leaveQueue = useCallback(async () => {
    if (statusRef.current !== "searching") return;

    // Optimistic update - set idle immediately for better UX
    setStatus("idle");
    setQueueSize(0);

    try {
      await matchmakingApi.leave();
    } catch (err) {
      console.error("Failed to leave queue:", err);
    }
  }, []);

  // Polling effect
  useEffect(() => {
    if (status !== "searching") return;

    const controller = new AbortController();

    const pollStatus = async () => {
      try {
        const data = await matchmakingApi.getStatus();

        // Check if we were aborted during the request
        if (controller.signal.aborted) return;

        if (
          data.status === "matched" &&
          data.matchId &&
          data.id &&
          data.wsToken
        ) {
          setMatchData({
            matchId: data.matchId,
            wsToken: data.wsToken,
            playerId: data.id,
          });
          setStatus("matched");
        } else if (data.status === "waiting") {
          setQueueSize(data.queueSize || 0);
        } else if (data.status === "error") {
          setError(new Error(data.message || "Matchmaking error"));
          setStatus("idle");
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      }
    };

    pollStatus();
    const intervalId = setInterval(pollStatus, POLLING_INTERVAL);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [status]);

  // Auto-leave queue on unmount if searching
  useEffect(() => {
    return () => {
      if (statusRef.current === "searching") {
        matchmakingApi.leave().catch(() => {});
      }
    };
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setQueueSize(0);
    setMatchData(null);
    setError(null);
  }, []);

  return {
    status,
    queueSize,
    matchData,
    error,
    joinQueue,
    leaveQueue,
    reset,
  };
}
