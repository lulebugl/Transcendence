import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Swords, GraduationCap } from "lucide-react";
import { useState } from "react";
import { GameTips } from "./GameTips";
import { SystemIndicator } from "@/components/ui/SystemIndicator";
import { GameModeCard } from "./GameModeCards";

type GameMode = "practice" | "ranked" | null;

export const Lobby = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handlePlay = () => {
    if (!selectedMode) return;
    setIsSearching(true);

    // TODO: Start matchmaking with selected mode
    // for now just simulate a search
    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  };

  const getButtonText = () => {
    if (!selectedMode) return "Select a Mode";

    if (isSearching) {
      return selectedMode === "ranked"
        ? "Searching for an opponent..."
        : "Loading game...";
    }

    return selectedMode === "practice" ? "Start Practice" : "Find Match";
  };

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
              onSelect={() => setSelectedMode("ranked")}
            />
            <GameModeCard
              mode="practice"
              title="Practice"
              description="Hone your skills against AI opponents. No pressure, no stakes."
              icon={GraduationCap}
              color="emerald"
              features={["Train against AI", "No Rank Impact", "Instant Start"]}
              isSelected={selectedMode === "practice"}
              onSelect={() => setSelectedMode("practice")}
            />
          </div>
        </section>

        <div
          className="flex flex-col items-center gap-4"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            variant="cyber"
            size="lg"
            className="min-w-64"
            disabled={!selectedMode || selectedMode === "practice"}
            loading={isSearching}
            onClick={handlePlay}
          >
            {selectedMode === "practice" ? "Coming soon" : getButtonText()}
          </Button>

          {selectedMode && !isSearching && (
            <p className="text-xs text-muted-foreground animate-fade-in">
              Press to find a match
            </p>
          )}
        </div>

        <GameTips />
      </div>
    </Layout>
  );
};

const LobbyHeader = () => (
  <section className="relative flex flex-col items-center text-center space-y-6">
    <div className="relative z-10 flex flex-col items-center space-y-4">
      <SystemIndicator text="Arena // Ready" />

      <h1
        className="text-5xl md:text-6xl font-bold tracking-tighter pt-2 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-2"
        style={{ animationDelay: "0.2s" }}
      >
        Lobby
      </h1>

      <p
        className="text-muted-foreground max-w-md leading-relaxed font-light"
        style={{ animationDelay: "0.3s" }}
      >
        Choose your arena. Practice your skills or climb the ranks.
      </p>
    </div>
  </section>
);
