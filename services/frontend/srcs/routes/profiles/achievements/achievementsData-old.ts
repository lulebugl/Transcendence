import {
  Shield,
  Star,
  Zap,
  Flame,
  Target,
  Trophy,
  Crown,
  Swords,
  LucideIcon,
} from "lucide-react";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  rarity: Rarity;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 1,
    name: "First Blood",
    description: "Win your first match",
    icon: Swords,
    unlocked: true,
    rarity: "common",
  },
  {
    id: 2,
    name: "Hot Streak",
    description: "Win 5 matches in a row",
    icon: Flame,
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Perfectionist",
    description: "Win a match 11-0",
    icon: Target,
    unlocked: true,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Tournament Victor",
    description: "Win a tournament",
    icon: Trophy,
    unlocked: true,
    rarity: "legendary",
  },
  {
    id: 5,
    name: "Diamond Hands",
    description: "Reach Diamond rank",
    icon: Crown,
    unlocked: true,
    rarity: "epic",
  },
  {
    id: 6,
    name: "Centurion",
    description: "Play 100 matches",
    icon: Shield,
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 7,
    name: "Speed Demon",
    description: "Win in under 2 minutes",
    icon: Zap,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: 8,
    name: "Legend",
    description: "Reach top 100 global",
    icon: Star,
    unlocked: false,
    rarity: "legendary",
  },
];

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

