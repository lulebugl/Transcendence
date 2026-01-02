import { SectionHeader } from "@/components/ui";
import { type ProfileData } from "@/types";
import { TrendingUp, Swords, Crown, Flame, Skull } from "lucide-react";

export const StatsGrid = ({ data }: { data: ProfileData }) => {
  if (!data) return null;

  const statItems = [
    {
      label: "Win Rate",
      value: `${data.winRate}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Games",
      value: `${data.gamesLost + data.gamesWon}`,
      icon: Swords,
      color: "text-blue-400",
    },
    {
      label: "Wins",
      value: `${data.gamesWon}`,
      icon: Crown,
      color: "text-purple-400",
    },
    {
      label: "Best Win Streak",
      value: `${data.bestWinStreak}`,
      icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Losses",
      value: `${data.gamesLost}`,
      icon: Skull,
      color: "text-red-500/80",
    },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Statistics"
        rightType="link"
        linkText="View achievements"
        linkTo={`/profile/${data.username}/achievements`}
        linkClassName="text-xs opacity-70 hover:opacity-100"
      />

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
    </div>
  );
};
