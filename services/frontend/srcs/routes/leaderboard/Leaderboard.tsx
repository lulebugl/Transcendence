import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { useQuery } from "@/hooks/useQuery";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { DottedBadge } from "@/components/ui/Badge";
import { getRankTextColor } from "@/lib/constants/";
import { playersApi } from "@/api/players";
import { UserAvatar } from "@/components/UserAvatar";
import { LeaderboardEntry } from "@/api/players";
import { getOnlineStatus } from "../../hooks/useProfileData";
import { SystemIndicator } from "@/components/ui/SystemIndicator";

export const Leaderboard = () => {
  const {
    data: players,
    isLoading,
    error,
  } = useQuery(() => playersApi.getLeaderboard(0, 100));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <LeaderboardHeader />

        <div className="space-y-6 w-full max-w-4xl mx-auto">
          <SectionHeader title="Top Players" />

          {isLoading && (
            <div className="glass-panel rounded-xl p-8 text-center text-muted-foreground animate-pulse">
              Loading leaderboard...
            </div>
          )}

          {error && (
            <div className="glass-panel rounded-xl p-8 text-center text-red-400">
              Failed to load leaderboard: {error.message}
            </div>
          )}

          {players && (
            <div
              className="glass-panel rounded-xl overflow-hidden"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="grid grid-cols-[2.5rem_1fr_4rem_5rem_5rem] md:grid-cols-[3rem_1fr_5rem_7rem_6rem] gap-4 px-5 py-4 border-b border-white/5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground bg-white/2">
                <span className="text-center">#</span>
                <span>Player</span>
                <span className="text-center">Level</span>
                <span className="text-center">Rank</span>
                <span className="text-center">Winrate</span>
              </div>

              {players && players.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {players.map((player, index) => (
                    <LeaderboardRow
                      key={`${player.userId}-${index}`}
                      player={player}
                      position={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-panel rounder-bottom-xl p-8 text-center text-muted-foreground">
                  No players on the leaderboard yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const LeaderboardHeader = () => (
  <section className="relative flex flex-col items-center text-center space-y-6">
    <div className="relative z-10 flex flex-col items-center space-y-4">
      <SystemIndicator text="Ranking // Global" />

      <h1
        className="text-5xl md:text-6xl font-bold tracking-tighter pt-2 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-2"
        style={{ animationDelay: "0.2s" }}
      >
        Leaderboard
      </h1>

      <p
        className="text-muted-foreground max-w-md leading-relaxed font-light"
        style={{ animationDelay: "0.3s" }}
      >
        See who dominates the arena and compete for the top spot.
      </p>
    </div>
  </section>
);

interface LeaderboardRowProps {
  player: LeaderboardEntry;
  position: number;
}

const LeaderboardRow = ({ player, position }: LeaderboardRowProps) => {
  const { user } = useAuth();
  const isCurrentUser = user && user.id === player.userId;
  const winrate = player.winRate?.toFixed(1) ?? undefined;

  return (
    <div
      className="grid grid-cols-[2.5rem_1fr_4rem_5rem_5rem] md:grid-cols-[3rem_1fr_5rem_7rem_6rem] gap-4 items-center px-5 py-4 hover:bg-white/2 transition-colors group cursor-pointer"
      tabIndex={0}
      role="row"
      key={player.userId}
      aria-label={`Position ${position}: ${player.username}`}
    >
      <span className="text-center text-sm font-mono text-muted-foreground">
        {position}
      </span>

      <Link
        to={isCurrentUser ? "/profile" : `/profile/${player.username}`}
        className="flex items-center gap-3 min-w-0"
      >
        <UserAvatar
          username={player.username}
          avatarUrl={player.avatarUrl}
          status={getOnlineStatus(player.lastCall)}
          className="w-9 h-9 rounded-full border border-white/10 grayscale-25 group-hover:grayscale-0 transition-all"
        />
        <span className="font-medium truncate group-hover:text-primary transition-colors">
          {player.username}
        </span>
        {isCurrentUser && <DottedBadge color="primary">You</DottedBadge>}
      </Link>

      <span className="text-center text-sm font-mono text-muted-foreground">
        {player.level ?? "-"}
      </span>
      <span
        className={cn(
          "text-center text-sm font-mono",
          getRankTextColor(player.rank)
        )}
      >
        {player.rank ?? "-"}
      </span>

      <span className="text-center text-sm font-mono text-muted-foreground">
        {winrate ? `${winrate}%` : "-"}
      </span>
    </div>
  );
};
