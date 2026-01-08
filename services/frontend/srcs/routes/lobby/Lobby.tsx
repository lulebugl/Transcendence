import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { toast } from "@/components/ui/toast";
import { Swords, GraduationCap, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { GameTips } from "./GameTips";
import { SystemIndicator } from "@/components/ui/SystemIndicator";
import { GameModeCard } from "./GameModeCards";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useAuth } from "@/hooks/useAuth";

type GameMode = "practice" | "ranked" | null;

export const Lobby = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { status, matchData, error, joinQueue, leaveQueue } = useMatchmaking();

  const isSearching = status === "searching";

  // Navigate on match
  useEffect(() => {
    if (status !== "matched" || !matchData) return;

    const url = `/pong-test?matchId=${
      matchData.matchId
    }&wsToken=${encodeURIComponent(matchData.wsToken)}`;
    navigate(url);
  }, [status, matchData, navigate]);

  const lastErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (!error) return;

    const errorMessage = error.message || "Matchmaking failed";
    if (lastErrorRef.current === errorMessage) return;

    lastErrorRef.current = errorMessage;
    toast.error(errorMessage);
  }, [error]);

  const handlePlay = () => {
    if (!selectedMode || selectedMode === "practice" || !user) return;
    joinQueue();
  };

  const getButtonText = () => {
    if (!selectedMode) return "Select a Mode";
    if (!user) return "Login to play";
    if (isSearching) return "Searching for an opponent...";
    if (selectedMode === "practice") return "Coming soon";
    return "Find Match";
  };

  const canPlay = selectedMode === "ranked" && user && !isSearching;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <LobbyHeader />

        <section className="space-y-6">
          <SectionHeader title="Select Game Mode" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameModeCard
              mode="ranked"
              title="Ranked"
              description="Climb the global ladder. Every match counts towards your rank."
              icon={Swords}
              color="primary"
              features={["Unlock Achievements", "Earn XP", "Leaderboard"]}
              isSelected={selectedMode === "ranked"}
              onSelect={() => {
                if (!isSearching) {
                  setSelectedMode("ranked");
                }
              }}
            />
            <GameModeCard
              mode="practice"
              title="Practice"
              description="Hone your skills against AI opponents. No pressure, no stakes."
              icon={GraduationCap}
              color="emerald"
              features={["Train against AI", "No Rank Impact", "Instant Start"]}
              isSelected={selectedMode === "practice"}
              onSelect={() => !isSearching && setSelectedMode("practice")}
            />
          </div>
        </section>

        <div
          className="flex flex-col items-center gap-4"
          style={{ animationDelay: "0.4s" }}
        >
          {isSearching ? (
            <SearchingState onCancel={leaveQueue} />
          ) : (
            <IdleState
              buttonText={getButtonText()}
              canPlay={canPlay}
              onPlay={handlePlay}
              showHint={selectedMode === "ranked" && !!user}
            />
          )}
        </div>

        <GameTips />
      </div>
    </Layout>
  );
};

const SearchingState = ({ onCancel }: { onCancel: () => void }) => (
  <div className="flex flex-col items-center gap-4 animate-fade-in">
    <div className="flex items-center gap-4">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
      <span className="text-sm text-muted-foreground">
        Searching for an opponent...
      </span>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onCancel}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
      aria-label="Cancel matchmaking"
    >
      <X className="w-4 h-4 mr-2" />
      Cancel
    </Button>
  </div>
);

interface IdleStateProps {
  buttonText: string;
  canPlay: boolean;
  onPlay: () => void;
  showHint: boolean;
}

const IdleState = ({
  buttonText,
  canPlay,
  onPlay,
  showHint,
}: IdleStateProps) => (
  <>
    <Button
      variant="cyber"
      size="lg"
      className="min-w-64"
      disabled={!canPlay}
      onClick={onPlay}
    >
      {buttonText}
    </Button>

    {showHint && (
      <p className="text-xs text-muted-foreground animate-fade-in">
        Press to find a match
      </p>
    )}
  </>
);

const LobbyHeader = () => (
  <section className="relative flex flex-col items-center text-center space-y-6">
    <div className="relative z-10 flex flex-col items-center space-y-4">
      <SystemIndicator text="Arena // Ready" />

      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter pt-2 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-2">
        Lobby
      </h1>

      <p className="text-muted-foreground max-w-md leading-relaxed font-light">
        Choose your arena. Practice your skills or climb the ranks.
      </p>
    </div>
  </section>
);
