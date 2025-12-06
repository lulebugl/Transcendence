/**
 * Centralized color schemes for the application.
 * Use these for consistent styling across components.
 */

import { Rank } from "@/types";

export type ColorScheme = keyof typeof colorSchemes;
export type ColorSchemeStyles = (typeof colorSchemes)[ColorScheme];

export const getColorScheme = (color: ColorScheme): ColorSchemeStyles =>
  colorSchemes[color];

export const getTextColor = (color: ColorScheme): string =>
  colorSchemes[color].text;

export const getBgColor = (color: ColorScheme): string =>
  colorSchemes[color].bg;

export const getBorderColor = (color: ColorScheme): string =>
  colorSchemes[color].border;

export const rankToColor: Record<Rank, ColorScheme> = {
  Diamond: "cyan",
  Platinum: "primary",
  Gold: "yellow",
  Silver: "silver",
};

/** Get the full color scheme for a rank */
export const getRankColorScheme = (rank: Rank): ColorSchemeStyles =>
  colorSchemes[rankToColor[rank]];

/** Get just the text color class for a rank */
export const getRankTextColor = (rank: Rank): string =>
  colorSchemes[rankToColor[rank]].text;

/** Get just the background color class for a rank */
export const getRankBgColor = (rank: Rank): string =>
  colorSchemes[rankToColor[rank]].bg;

/** Get the color scheme key for a rank (useful for Badge component) */
export const getRankColor = (rank: Rank): ColorScheme => rankToColor[rank];

export const colorSchemes = {
  primary: {
    border: "border-primary/40",
    bg: "bg-primary/5",
    text: "text-primary",
    hoverBg: "group-hover:bg-primary/10",
    hoverBorder: "group-hover:border-primary/60",
  },
  silver: {
    border: "border-white/40",
    bg: "bg-white/5",
    text: "text-white",
    hoverBg: "group-hover:bg-white/10",
    hoverBorder: "group-hover:border-white/60",
  },
  platinum: {
    border: "border-primary/40",
    bg: "bg-primary/5",
    text: "text-primary",
    hoverBg: "group-hover:bg-primary/10",
    hoverBorder: "group-hover:border-primary/60",
  },
  diamond: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/5",
    text: "text-blue-500",
    hoverBg: "group-hover:bg-blue-500/10",
    hoverBorder: "group-hover:border-blue-500/60",
  },
  emerald: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/5",
    text: "text-emerald-500",
    hoverBg: "group-hover:bg-emerald-500/10",
    hoverBorder: "group-hover:border-emerald-500/60",
  },
  red: {
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    text: "text-red-500",
    hoverBg: "group-hover:bg-red-500/10",
    hoverBorder: "group-hover:border-red-500/60",
  },
  yellow: {
    border: "border-yellow-300/40",
    bg: "bg-yellow-300/5",
    text: "text-yellow-300",
    hoverBg: "group-hover:bg-yellow-300/10",
    hoverBorder: "group-hover:border-yellow-300/60",
  },
  purple: {
    border: "border-purple-500/40",
    bg: "bg-purple-500/5",
    text: "text-purple-500",
    hoverBg: "group-hover:bg-purple-500/10",
    hoverBorder: "group-hover:border-purple-500/60",
  },
  cyan: {
    border: "border-cyan-400/40",
    bg: "bg-cyan-400/5",
    text: "text-cyan-400",
    hoverBg: "group-hover:bg-cyan-400/10",
    hoverBorder: "group-hover:border-cyan-400/60",
  },
} as const;
