import { Link } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { ChevronLeft } from "lucide-react";
import {
  ACHIEVEMENTS_DATA,
  Rarity,
  rarityBorders,
  rarityGradients,
  rarityColors,
} from "./achievementsData";
import { useMemo } from "react";
import { Lock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const Achievements = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 md:py-12 space-y-6 animate-fade-in">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          aria-label="Back to profile"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Profile</span>
        </Link>

        <AchievementsList />
      </div>
    </Layout>
  );
};

const AchievementsList = () => {
  const achievements = useMemo(() => ACHIEVEMENTS_DATA, []);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Achievements"
        rightType="info"
        info={`${unlockedCount} / ${achievements.length} Unlocked`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className={`relative glass-panel rounded-xl p-4 flex flex-col items-center gap-3 group transition-all cursor-default ${
              achievement.unlocked
                ? rarityBorders[achievement.rarity as Rarity]
                : "opacity-40 grayscale"
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 py-1 rounded-full flex items-center justify-center bg-linear-to-br ${
                achievement.unlocked
                  ? rarityGradients[achievement.rarity as Rarity]
                  : "bg-gray-700"
              }`}
            >
              {achievement.unlocked ? (
                <achievement.icon className="w-5 h-5 text-white" />
              ) : (
                <Lock className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-xs font-medium">{achievement.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                {achievement.description}
              </p>
            </div>

            {/* Rarity */}
            {achievement.unlocked && (
              <span
                className={`text-[8px] uppercase tracking-[0.2em] ${
                  rarityColors[achievement.rarity as Rarity]
                }`}
              >
                {achievement.rarity}
              </span>
            )}

            {/* Locked Overlay */}
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
