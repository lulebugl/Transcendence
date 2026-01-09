import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SystemIndicator } from "@/components/ui/SystemIndicator";
import { Link, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useInfiniteMatchHistory, type MatchResult } from "@/hooks/useMatchHistory";
import { useRef, useEffect } from "react";
import { useParams } from "react-router";
const MATCHES_PER_PAGE = 50;

export const MatchHistory = () => {
  const { user } = useAuth();
  const { playerId } = useParams();

  const effectivePlayerId = playerId ? Number(playerId) : user?.id ?? 0;
  const {
    matches,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useInfiniteMatchHistory(effectivePlayerId, MATCHES_PER_PAGE);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <MatchHistoryHeader />

        <div className="space-y-6 w-full max-w-4xl mx-auto">
          <SectionHeader title="Your Matches" />

          {isLoading && (
            <div className="glass-panel rounded-xl p-8 text-center text-muted-foreground animate-pulse">
              Loading match history...
            </div>
          )}

          {error && !isLoading && (
            <div className="glass-panel rounded-xl p-8 text-center text-red-400">
              Failed to load match history: {error.message}
            </div>
          )}

          {!isLoading && !error && matches.length === 0 && (
            <div className="glass-panel rounded-xl p-8 text-center text-muted-foreground">
              No matches found. Play some games to see your history!
            </div>
          )}

          {matches.length > 0 && (
            <div
              className="glass-panel rounded-xl overflow-hidden"
            >
              <div className="grid grid-cols-[1rem_1fr_4rem_5rem] md:grid-cols-[1rem_1fr_5rem_6rem_6rem] gap-4 px-5 py-4 border-b border-white/5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground bg-white/2">
                <span></span>
                <span>Opponent</span>
                <span className="text-center">Score</span>
                <span className="text-center hidden md:block">XP</span>
                <span className="text-center">Time</span>
              </div>

              <div className="divide-y divide-white/5">
                {matches.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && !isLoading && (
            <div ref={loadMoreRef} className="py-4">
              {isLoadingMore && (
                <div className="text-center text-muted-foreground animate-pulse">
                  Loading more matches...
                </div>
              )}
            </div>
          )}

          {!hasMore && matches.length > 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">
              You've reached the end of your match history
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const MatchHistoryHeader = () => (
  <section className="relative flex flex-col items-center text-center space-y-6">
    <div className="relative z-10 flex flex-col items-center space-y-4">
      <SystemIndicator text="History // Matches" />

      <h1
        className="text-5xl md:text-6xl font-bold tracking-tighter pt-2 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-2"
        style={{ animationDelay: "0.2s" }}
      >
        Match History
      </h1>

      <p
        className="text-muted-foreground max-w-md leading-relaxed font-light"
        style={{ animationDelay: "0.3s" }}
      >
        Review your past battles and track your progress over time.
      </p>
    </div>
  </section>
);

interface MatchRowProps {
  match: MatchResult;
}

const MatchRow = ({ match }: MatchRowProps) => {
  const isWin = match.result === "WIN";

  return (
    <div
      className="grid grid-cols-[1rem_1fr_4rem_5rem] md:grid-cols-[1rem_1fr_5rem_6rem_6rem] gap-4 items-center px-5 py-4 hover:bg-white/2 transition-colors group"
      role="row"
    >
      {/* Result Indicator */}
      <div
        className={`w-1 h-10 rounded-full ${
          isWin
            ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
            : "bg-red-500/80 shadow-[0_0_10px_#ef4444]"
        }`}
      />

      {/* Opponent */}
      <Link
        to={`/profile/${match.opponentName}`}
        className="flex items-center gap-3 min-w-0"
      >
        <img
          src={match.opponentAvatar}
          alt={match.opponentName}
          className="w-9 h-9 rounded-full border border-white/10 grayscale-25 group-hover:grayscale-0 transition-all"
        />
        <span className="font-medium truncate group-hover:text-primary transition-colors">
          {match.opponentName}
        </span>
      </Link>

      {/* Score */}
      <div className="text-center">
        <span className="font-mono text-sm">
          <span className={isWin ? "text-emerald-400" : "text-muted-foreground"}>
            {match.myScore}
          </span>
          <span className="text-muted-foreground/40 mx-1">-</span>
          <span className={!isWin ? "text-red-400" : "text-muted-foreground"}>
            {match.opponentScore}
          </span>
        </span>
      </div>

      {/* XP */}
      <span
        className={`text-center text-sm font-mono hidden md:block ${
          match.xpGained > 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {match.xpGained > 0 ? "+" : ""}
        {match.xpGained} XP
      </span>

      {/* Time */}
      <span className="text-center text-xs text-muted-foreground">
        {match.relativeTime}
      </span>
    </div>
  );
};
