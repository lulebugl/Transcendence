import { checkAchievements } from "../routes/achievements/achievements-utils";
import { recordMatch } from "../blockchain/blockchain";
import { eq, inArray } from "drizzle-orm";
import { userStats } from "../db/schema";
import { db } from "../db/client";
import { computeMatchXp, levelFromXp, xpForLevel } from "./expCounter";

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

export interface GameCompletionData extends GameResult {
  durationSeconds?: number;
}

/**
 * Processes game completion: updates stats, checks achievements, and records on blockchain
 */
export async function processGameCompletion(data: GameCompletionData) {
  const { player1Id, player2Id, player1Score, player2Score, durationSeconds } =
    data;

  const xpResult = await updatePostGameStats({
    player1Id,
    player2Id,
    player1Score,
    player2Score,
  });

  await Promise.all([
    checkAchievements(player1Id, {
      score: player1Score,
      opponentScore: player2Score,
      durationSeconds,
    }),
    checkAchievements(player2Id, {
      score: player2Score,
      opponentScore: player1Score,
      durationSeconds,
    }),
  ]);

  // Record match on blockchain if XP was gained (not a draw)
  let blockchainResult;
  if (xpResult) {
    blockchainResult = await recordMatch({
      playerId1: player1Id,
      playerId2: player2Id,
      score1: player1Score,
      score2: player2Score,
      expGained1: xpResult.player1XpGain,
      expGained2: xpResult.player2XpGain,
    });
  }

//   console.log("blockchainResult", blockchainResult);
  return {
    xpResult,
    // blockchainResult,
  };
}

/**
 * Calculates new level and XP (into current level) after gaining XP
 * Returns the XP remainder for the new level (starting from 0)
 */
function calculateNewLevelAndXp(
  currentXp: number,
  xpGain: number
): { level: number; xp: number } {
  const newTotalXp = currentXp + xpGain;
  const newLevel = levelFromXp(newTotalXp);
  const levelXp = xpForLevel(newLevel);
  const xpRemainder = newTotalXp - levelXp;

  return { level: newLevel, xp: xpRemainder };
}

/**
 * Update player stats and calculate XP gains
 */
export async function updatePostGameStats(
  result: GameResult
): Promise<XpResult | null> {
  const { player1Id, player2Id, player1Score, player2Score } = result;

  // Skip draws
  if (player1Score === player2Score) return null;

  const p1Won = player1Score > player2Score;

  const stats = await db
    .select({
      userId: userStats.user_id,
      xp: userStats.xp,
      level: userStats.level,
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

  const p1TotalXp = xpForLevel(p1Stats.level) + p1Stats.xp;
  const p2TotalXp = xpForLevel(p2Stats.level) + p2Stats.xp;

  const { xpAGain: player1XpGain, xpBGain: player2XpGain } = computeMatchXp(
    player1Score,
    player2Score,
    p1TotalXp,
    p2TotalXp
  );

  const player1 = calculateNewLevelAndXp(p1TotalXp, player1XpGain);
  const player2 = calculateNewLevelAndXp(p2TotalXp, player2XpGain);

  const p1NewStreak = p1Won ? p1Stats.currentStreak + 1 : 0;
  const p2NewStreak = p1Won ? 0 : p2Stats.currentStreak + 1;

  await Promise.all([
    db
      .update(userStats)
      .set({
        xp: player1.xp,
        level: player1.level,
        games_played: p1Stats.gamesPlayed + 1,
        games_won: p1Won ? p1Stats.gamesWon + 1 : p1Stats.gamesWon,
        games_lost: p1Won ? p1Stats.gamesLost : p1Stats.gamesLost + 1,
        current_win_streak: p1NewStreak,
        best_win_streak: Math.max(p1Stats.bestStreak, p1NewStreak),
        updated_at: new Date(),
      })
      .where(eq(userStats.user_id, player1Id)),

    db
      .update(userStats)
      .set({
        xp: player2.xp,
        level: player2.level,
        games_played: p2Stats.gamesPlayed + 1,
        games_won: p1Won ? p2Stats.gamesWon : p2Stats.gamesWon + 1,
        games_lost: p1Won ? p2Stats.gamesLost + 1 : p2Stats.gamesLost,
        current_win_streak: p2NewStreak,
        best_win_streak: Math.max(p2Stats.bestStreak, p2NewStreak),
        updated_at: new Date(),
      })
      .where(eq(userStats.user_id, player2Id)),
  ]);

  return { player1XpGain, player2XpGain };
}
