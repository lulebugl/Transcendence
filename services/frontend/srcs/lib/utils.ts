import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { Rank } from "@/types/players";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toEpochMs = (
  value: number | string | Date | null | undefined
): number => {
  if (!value) return 0;
  // If it's a number less than year 2000 in ms, assume it's in seconds
  if (typeof value === "number" && value < 946684800000) {
    return value * 1000;
  }
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
};

// return a relative time string
// i.e "1 hour ago" or "2 days ago"
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - toEpochMs(timestamp);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (months > 0) return `${months} months ago`;
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return new Date(timestamp).toLocaleString();
};

export const getRank = (level: number): Rank => {
  if (level >= 30) return "Platinum";
  if (level >= 20) return "Diamond";
  if (level >= 10) return "Gold";
  return "Silver";
};
