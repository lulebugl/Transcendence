import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Trophy, Swords, Target, Flame, TrendingUp, Users } from "lucide-react";
import { AchievementsCard } from "./AchievementsCard";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchHistory } from "@/features/MatchHistory";
import { ProfileHeader, MOCK_USER } from "./ProfileHeader";

const MOCK_STATS = {
  totalGames: 342,
  wins: 198,
  losses: 144,
  winRate: 57.9,
  currentStreak: 5,
  longestStreak: 12,
  averageScore: 9.2,
  perfectGames: 23,
  tournamentWins: 3,
};

const StatsGrid = ({ stats }: { stats: typeof MOCK_STATS }) => {
  const statItems = [
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Games",
      value: stats.totalGames.toString(),
      icon: Swords,
      color: "text-blue-400",
    },
    {
      label: "Current Streak",
      value: `${stats.currentStreak}`,
      icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Perfect Games",
      value: stats.perfectGames.toString(),
      icon: Target,
      color: "text-purple-400",
    },
    {
      label: "Tournament Wins",
      value: stats.tournamentWins.toString(),
      icon: Trophy,
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Statistics
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground/60">
          W: {stats.wins} • L: {stats.losses}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px overflow-hidden">
        {statItems.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-background p-6 flex flex-col items-center gap-3 group hover:bg-white/2 transition-colors cursor-default"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <stat.icon
              className={`w-5 h-5 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}
            />
            <div className="text-center">
              <p className="text-2xl font-light font-mono tracking-tight group-hover:scale-110 transition-transform">
                {stat.value}
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const QuickActions = () => {
  return (
    <section className="flex flex-wrap gap-3 justify-center md:justify-start">
      <Button variant="cyber" size="lg">
        <Swords className="w-4 h-4" />
        Find Match
      </Button>
      <Button variant="glass" size="lg">
        <Users className="w-4 h-4" />
        Friends
      </Button>
      <Button variant="glass" size="lg">
        <Trophy className="w-4 h-4" />
        Tournaments
      </Button>
    </section>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const UserProfile = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-12 animate-fade-in">
        <ProfileHeader user={MOCK_USER} />
        <StatsGrid stats={MOCK_STATS} />
        {/* <QuickActions /> */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <MatchHistory matches={MOCK_MATCHES} />
          </div>
          <div className="lg:col-span-2">
            <AchievementsCard maxDisplay={8} showLocked={true} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

