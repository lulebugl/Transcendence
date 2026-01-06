import {
  Shield,
  Star,
  Zap,
  Flame,
  Target,
  Crown,
  Swords,
  LucideIcon,
} from "lucide-react";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface AchievementMetadata {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
}

export const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  first_blood: Swords,
  hot_streak: Flame,
  perfectionist: Target,
  centurion: Shield,
  speed_demon: Zap,
  legend: Star,
};

export interface Achievement extends AchievementMetadata {
  icon: LucideIcon;
  unlocked: boolean;
}

export const rarityColors: Record<Rarity, string> = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-500",
};

export const rarityIconBg: Record<Rarity, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

export const rarityBorders: Record<Rarity, string> = {
  common: "border-gray-500/30 hover:border-gray-500/50",
  rare: "border-blue-500/30 hover:border-blue-500/50",
  epic: "border-purple-500/30 hover:border-purple-500/50",
  legendary: "border-yellow-500/30 hover:border-yellow-500/50",
};

export const rarityGradients: Record<Rarity, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};
