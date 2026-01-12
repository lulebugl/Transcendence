import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "react-router";
import { useMatchHistory } from "../../../hooks/useMatchHistory";
import { UserAvatar } from "@/components/UserAvatar";

interface MatchHistoryProps {
  playerId: number;
  offset?: number;
  count?: number;
}

export const MatchHistorySection = ({
  playerId,
  count = 10,
  offset = 0,
}: MatchHistoryProps) => {
  const { matchHistory, isLoading, error } = useMatchHistory(
    playerId,
    count > 10 ? 10 : count,
    offset
  );

  if (isLoading) {
    return <MatchHistorySkeleton />;
  }

  if (error || !matchHistory || !matchHistory.length) return <MatchNotFound />;
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Recent Matches"
        rightType="link"
        linkText="View all matches"
        linkTo={`/profile/${playerId}/match-history`}
      />
      <div className="space-y-2">
        {matchHistory.map((match) => (
          <div
            key={match.id}
            className="glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 group hover:border-white/10"
          >
            {/* Result Indicator */}
            <div
              className={`w-1 h-12 rounded-full ${
                match.result === "WIN"
                  ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  : "bg-red-500/80 shadow-[0_0_10px_#ef4444]"
              }`}
            />

            {/* Opponent */}
            <div className="flex-1 min-w-0 w-full">
              <Link
                to={`/profile/${match.opponentName}`}
                className="flex items-center gap-3 cursor-pointer w-fit"
              >
                <UserAvatar
                  username={match.opponentName}
                  avatarUrl={match.opponentAvatar}
                  className="w-10 h-10 rounded-full border border-white/10 grayscale-25 group-hover:grayscale-0 transition-all"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {match.opponentName}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {match.opponentRank}
                  </p>
                </div>
              </Link>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              <p className="text-xl font-mono font-light tracking-wider">
                <span
                  className={
                    match.result === "WIN"
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                  }
                >
                  {match.myScore}
                </span>
                <span className="text-muted-foreground/40 mx-1">-</span>
                <span
                  className={
                    match.result === "LOSS"
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }
                >
                  {match.opponentScore}
                </span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                {match.result}
              </p>
            </div>

            {/* Meta */}
            <div className="hidden md:flex flex-col items-end gap-1 text-right min-w-[100px]">
              <span
                className={`text-xs font-mono ${
                  match.xpGained > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {match.xpGained > 0 ? "+" : ""}
                {match.xpGained} XP
              </span>
              <span className="text-[10px] text-muted-foreground">
                {match.relativeTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MatchHistorySkeleton = () => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Recent Matches"
        rightType="link"
        linkText="View all matches"
        linkTo="/profile/match-history"
      />
      <div
        className="glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 group hover:border-white/10 animate-pulse"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
        <div className="flex-1 min-w-0 w-full">
          <div className="min-w-0">
            <p className="font-medium truncate group-hover:text-primary text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MatchNotFound = () => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Recent Matches"
        rightType="link"
        linkText="View all matches"
        linkTo="/profile/match-history"
      />
      <div className="glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 group hover:border-white/10">
        <div className="flex-1 min-w-0 w-full">
          <div className="min-w-0">
            <p className="font-medium truncate group-hover:text-primary text-muted-foreground text-center">
              No recent matches found
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
