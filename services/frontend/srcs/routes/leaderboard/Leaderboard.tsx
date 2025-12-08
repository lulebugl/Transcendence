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
import { getOnlineStatus } from "../profiles/hooks/useProfileData";

// maybe add a button to refresh the leaderboard
export const Leaderboard = () => {
  const {
    data: players,
    isLoading,
    error,
  } = useQuery(() => playersApi.getLeaderboard());

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-6 py-12 md:py-20 animate-fade-in">
        <div className="space-y-6 w-full">
          <SectionHeader title="Leaderboard" />

          {isLoading && (
            <div className="glass-panel rounded-xl p-8 text-center text-muted-foreground">
              Loading leaderboard...
            </div>
          )}

          {error && (
            <div className="glass-panel rounded-xl p-8 text-center text-red-400">
              Failed to load leaderboard: {error.message}
            </div>
          )}

          {players && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem_4rem] md:grid-cols-[3rem_1fr_7rem_4rem_5rem] gap-4 px-5 py-4 border-b border-white/5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <span className="text-center">#</span>
                <span>Player</span>
                <span className="text-center">Rank</span>
                <span className="text-right">Winrate</span>
                <span className="text-center">Level</span>
              </div>

              {players.map((player, index) => (
                <LeaderboardRow
                  key={player.userId}
                  player={player}
                  position={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

interface LeaderboardRowProps {
  player: LeaderboardEntry;
  position: number;
}

const LeaderboardRow = ({ player, position }: LeaderboardRowProps) => {
  const { user } = useAuth();
  const isCurrentUser = user?.id === player.userId;
  const winrate = player.winRate?.toFixed(1) ?? undefined;

  return (
    <div
      className="grid grid-cols-[2.5rem_1fr_5rem_5rem_4rem] md:grid-cols-[3rem_1fr_7rem_4rem_5rem] gap-4 items-center px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors group cursor-pointer animate-fade-in-up"
      tabIndex={0}
      role="row"
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

      <span className="text-center text-sm font-mono text-muted-foreground">
        {player.level ?? "-"}
      </span>
    </div>
  );
};
