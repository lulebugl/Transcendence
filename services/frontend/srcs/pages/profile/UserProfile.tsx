import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/lib/ui/Badge";
import { Button } from "@/lib/ui/button";
import { Trophy, Swords, Target, Flame, TrendingUp, Users, Edit3 } from "lucide-react";
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

// const ProfileHeader = ({
//   user,
//   stats,
// }: {
//   user: typeof MOCK_USER;
//   stats: typeof MOCK_STATS;
// }) => {
//   const xpProgress = (user.xp / user.nextLevelXp) * 100;

//   const quickStats = [
//     { value: `#${user.rankPosition}`, label: "Rank" },
//     { value: `${stats.winRate}%`, label: "Win Rate" },
//     { value: `${stats.totalGames}`, label: "Games" },
//     { value: `${stats.currentStreak}`, label: "Streak" },
//   ];

//   return (
//     <section className="glass-panel rounded-2xl p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center gap-6">
//         {/* Left: Avatar + Info */}
//         <div className="flex items-center gap-5 flex-1">
//           {/* Avatar */}
//           <div className="relative shrink-0">
//             <img
//               src={user.avatar_url}
//               alt={`${user.username}'s avatar`}
//               className="w-16 h-16 rounded-full border border-white/10 object-cover"
//             />
//             <div
//               className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card ${
//                 user.status === "online"
//                   ? "bg-emerald-500"
//                   : "bg-muted-foreground"
//               }`}
//             />
//           </div>

//           {/* Name + Level */}
//           <div className="min-w-0">
//             <div className="flex items-center gap-2 mb-1">
//               <h1 className="text-xl font-bold tracking-tight truncate">
//                 {user.username}
//               </h1>
//               <Badge color="blue">{user.rank}</Badge>
//             </div>
//             <div className="flex items-center gap-3 text-xs text-muted-foreground">
//               <span>
//                 Lv. <span className="text-primary font-mono">{user.level}</span>
//               </span>
//               <div className="flex items-center gap-2 flex-1 max-w-32">
//                 <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-primary rounded-full"
//                     style={{ width: `${xpProgress}%` }}
//                   />
//                 </div>
//                 <span className="text-[10px] font-mono text-muted-foreground/60">
//                   {Math.round(xpProgress)}%
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right: Quick Stats */}
//         <div className="flex gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-8">
//           {quickStats.map((stat) => (
//             <div key={stat.label} className="text-center">
//               <p className="text-lg font-mono font-light">{stat.value}</p>
//               <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

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

