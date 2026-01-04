import { db } from "../db/client";
import { eq, inArray } from "drizzle-orm";
import { userStats } from "../db/schema";
import { computeMatchXp, levelFromXp } from "./expCounter";

export interface GameResult {
  player1Id: number;
  player2Id: number;
  player1Score: number;
  player2Score: number;
}

export interface XpResult {
  player1XpGain: number;
  player2XpGain: number;
}

export async function updatePostGameStats(result: GameResult): Promise<XpResult | null> {
  const { player1Id, player2Id, player1Score, player2Score } = result;

  // Skip draws
  if (player1Score === player2Score) return null;

  const p1Won = player1Score > player2Score;

  const stats = await db
    .select({
      userId: userStats.user_id,
      xp: userStats.xp,
      gamesPlayed: userStats.games_played,
      gamesWon: userStats.games_won,
      gamesLost: userStats.games_lost,
      currentStreak: userStats.current_win_streak,
      bestStreak: userStats.best_win_streak,
    })
    .from(userStats)
    .where(inArray(userStats.user_id, [player1Id, player2Id]));

  const p1Stats = stats.find((s) => s.userId === player1Id);
  const p2Stats = stats.find((s) => s.userId === player2Id);

  if (!p1Stats || !p2Stats) return null;

  const { xpAGain: player1XpGain, xpBGain: player2XpGain } = computeMatchXp(
    player1Score,
    player2Score,
    p1Stats.xp,
    p2Stats.xp
  );

  const p1NewXp = p1Stats.xp + player1XpGain;
  const p2NewXp = p2Stats.xp + player2XpGain;
  const p1NewStreak = p1Won ? p1Stats.currentStreak + 1 : 0;
  const p2NewStreak = p1Won ? 0 : p2Stats.currentStreak + 1;

  await Promise.all([
    db.update(userStats).set({
      xp: p1NewXp,
      level: levelFromXp(p1NewXp),
      games_played: p1Stats.gamesPlayed + 1,
      games_won: p1Won ? p1Stats.gamesWon + 1 : p1Stats.gamesWon,
      games_lost: p1Won ? p1Stats.gamesLost : p1Stats.gamesLost + 1,
      current_win_streak: p1NewStreak,
      best_win_streak: Math.max(p1Stats.bestStreak, p1NewStreak),
      updated_at: new Date(),
    }).where(eq(userStats.user_id, player1Id)),

    db.update(userStats).set({
      xp: p2NewXp,
      level: levelFromXp(p2NewXp),
      games_played: p2Stats.gamesPlayed + 1,
      games_won: p1Won ? p2Stats.gamesWon : p2Stats.gamesWon + 1,
      games_lost: p1Won ? p2Stats.gamesLost + 1 : p2Stats.gamesLost,
      current_win_streak: p2NewStreak,
      best_win_streak: Math.max(p2Stats.bestStreak, p2NewStreak),
      updated_at: new Date(),
    }).where(eq(userStats.user_id, player2Id)),
  ]);

  return { player1XpGain, player2XpGain };
}
