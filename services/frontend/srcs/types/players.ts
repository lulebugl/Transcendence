export type Rank = "Diamond" | "Platinum" | "Gold" | "Silver";
export type OnlineStatus = "online" | "offline" | "away";

export interface ProfileData {
  // Core identity (from User)
  id: number;
  username: string;
  avatarUrl: string | null;
  onlineStatus: OnlineStatus;

  // Stats (from UserStats)
  level: number;
  xp: number;
  rank: Rank;
  memberSince: string;
  nextLevelXp: number;
  winRate: number;
  gamesWon: number;
  gamesLost: number;
  bestWinStreak: number;
  rankPosition?: number; // not implemented yet
}
