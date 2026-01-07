import { useRef } from "react";
import { Loading } from "@/components/Loading";
import { usePongGame } from "./usePongGame";
import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";

export const TestPongDev = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading, cleanup } = usePongGame(canvasRef);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleResume = useCallback(() => {
    setIsMenuOpen(false);
    canvasRef.current?.focus();
  }, []);

  const handleQuit = useCallback(() => {
    cleanup?.();
    navigate("/lobby");
  }, [cleanup, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            <a
              href="/lobby"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Go to Lobby
            </a>
          </div>
        </div>
      )}

	  {/* this is the menu of the game */}
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md" onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Game Menu</DialogTitle>
            <DialogDescription>
              The match is still running. Quitting will forfeit the game.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleResume} className="w-full">
              Resume Game
            </Button>
            <Button
              variant="destructive"
              onClick={handleQuit}
              className="w-full"
            >
              Quit Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
