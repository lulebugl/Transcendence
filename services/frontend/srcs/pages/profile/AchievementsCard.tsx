import { useMemo } from "react";
import { Lock } from "lucide-react";
import {
  ACHIEVEMENTS_DATA,
  rarityColors,
  rarityIconBg,
  type Rarity,
} from "./achievementsData";
import { SectionHeader } from "@/components/SectionHeaders";

interface AchievementsCardProps {
  maxDisplay?: number;
  showLocked?: boolean;
}

export const AchievementsCard = ({
  maxDisplay = 5,
  showLocked = true,
}: AchievementsCardProps) => {
  const achievements = useMemo(() => ACHIEVEMENTS_DATA, []);

  // Show unlocked achievements first, then optionally locked ones
  const displayAchievements = useMemo(() => {
    const unlocked = achievements.filter((a) => a.unlocked);
    const locked = achievements.filter((a) => !a.unlocked);

    if (showLocked) {
      return [...unlocked, ...locked].slice(0, maxDisplay);
    }
    return unlocked.slice(0, maxDisplay);
  }, [achievements, maxDisplay, showLocked]);

  return (
    <section className="space-y-4">
	  <SectionHeader title="Achievements" rightType="link" linkText="See all achievements" linkTo="/profile/achievements" />

      {/* Achievement List */}
      <ul className="glass-panel rounded-xl p-2 space-y-2" role="list" aria-label="Recent achievements">
        {displayAchievements.map((achievement, index) => (
          <li
            key={achievement.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors group ${
              achievement.unlocked
                ? "hover:bg-white/5 cursor-default"
                : "opacity-50"
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
            tabIndex={0}
            aria-label={`${achievement.name}: ${achievement.description}${
              achievement.unlocked ? ", unlocked" : ", locked"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-linear-to-br ${
                achievement.unlocked
                  ? rarityIconBg[achievement.rarity as Rarity]
                  : "from-gray-700 to-gray-800"
              }`}
            >
              {achievement.unlocked ? (
                <achievement.icon className="w-4 h-4 text-white" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-gray-500" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{achievement.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {achievement.description}
              </p>
            </div>

            {/* Rarity Badge */}
            {/* {achievement.unlocked && ( */}
              <span
                className={`text-[9px] uppercase tracking-wider font-medium ${
                  achievement.unlocked ? rarityColors[achievement.rarity as Rarity] : "text-gray-500"
                }`}
              >
                {achievement.unlocked ? achievement.rarity : "Locked"}
              </span>
            {/* )} */}
          </li>
        ))}
      </ul>
    </section>
  );
};
