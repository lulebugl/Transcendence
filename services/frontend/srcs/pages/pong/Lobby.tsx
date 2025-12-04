import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { fetchPongAssets } from "./fetchAssets";

export const Lobby = () => {
  const [status, setStatus] = useState<"idle" | "searching" | "matched">("idle");
  const [queueSize, setQueueSize] = useState(0);
  const navigate = useNavigate();
  const playerIdRef = useRef<string>(crypto.randomUUID());

  const joinQueue = async () => {
    setStatus("searching");
    const username = "User_" + playerIdRef.current.slice(0, 4);

    try {
      await fetch('/api/matchmaking/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, playerId: playerIdRef.current })
      });
    } catch (e) {
      console.error("Failed to join queue", e);
      setStatus("idle");
    }
  };

  useEffect(() => {
    fetchPongAssets();
    let interval: NodeJS.Timeout;
    if (status === "searching") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/matchmaking/status?playerId=${playerIdRef.current}`);
          const data = await res.json();
          if (data.status === "matched") {
            setStatus("matched");
            navigate(`/pong-test?matchId=${data.matchId}&playerId=${playerIdRef.current}`);
          } else if (data.status === "waiting") {
            setQueueSize(data.queueSize);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center mt-20 gap-6">
        <h1 className="text-4xl font-bold mb-8">Lobby</h1>

        <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center min-w-[300px]">
          {status === "idle" && (
            <button
              onClick={joinQueue}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Find Match
            </button>
          )}

          {status === "searching" && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-xl">Searching for opponent...</p>
              <p className="text-gray-400">Players in queue: {queueSize}</p>
            </div>
          )}

          {status === "matched" && (
            <div className="space-y-4">
              <div className="text-green-500 text-5xl">✓</div>
              <p className="text-xl">Match found!</p>
              <p className="text-gray-400">Redirecting to game...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
