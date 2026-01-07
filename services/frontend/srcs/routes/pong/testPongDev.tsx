import { useRef } from "react";
import { Loading } from "@/components/Loading";
import { usePongGame } from "./usePongGame";

export const TestPongDev = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading } = usePongGame(canvasRef);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <Loading />
        </div>
      )}
      {!new URLSearchParams(window.location.search).get("matchId") && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Match ID</h2>
            <p className="mb-4">Please join a game from the Lobby.</p>
            <a href="/lobby" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Go to Lobby</a>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="renderCanvas"
        className="block h-screen! w-screen outline-none"
        role="img"
        aria-label="Transcendence pong arena"
        tabIndex={0}
      />
    </div>
  );
};
