export type PlayerRank = "Diamond" | "Platinum" | "Gold" | "Silver";

export const getPlayerRank = (level: number): PlayerRank => {
  if (level >= 30) return "Platinum";
  if (level >= 20) return "Diamond";
  if (level >= 10) return "Gold";
  return "Silver";
};
