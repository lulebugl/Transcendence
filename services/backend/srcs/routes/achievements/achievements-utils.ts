import { db } from "../../db/client";
import {
  userAchievements,
  userStats,
  achievements,
  UserStats,
} from "../../db/schema";
import { eq, and, count, gt } from "drizzle-orm";

// example of its use in seed.ts
// After game completion
// const unlocked = await checkAchievements(userId, {
// 	score: playerScore,
// 	opponentScore: opponentScore,
// 	durationSeconds: gameDuration,
//   });

interface GameData {
  score: number;
  opponentScore: number;
  durationSeconds?: number;
}

type AchievementChecker = (
  stats: UserStats,
  gameData?: GameData
) => Promise<boolean>;

/*
 * those are the achievements available in the database
 * for new achievements, add the checker here
 * and seed or add to the db the new achievement
 */
const ACHIEVEMENT_CHECKERS: Record<string, AchievementChecker> = {
  first_blood: async (stats) => stats.games_won >= 1,
  hot_streak: async (stats) =>
    stats.current_win_streak >= 5 || stats.best_win_streak >= 5,
  centurion: async (stats) => stats.games_played >= 100,
  grinder: async (stats) => stats.level >= 30,
  perfectionist: async (stats, gameData) => {
    return gameData?.score === 11 && gameData?.opponentScore === 0;
  },
  speed_demon: async (stats, gameData) => {
    return (
      gameData?.score > gameData?.opponentScore && 
      gameData?.durationSeconds !== undefined &&
      gameData.durationSeconds < 120 
    );
  },
};

// Check if user has the achievement
async function hasAchievement(
  userId: number,
  achievementId: string
): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(userAchievements)
    .where(
      and(
        eq(userAchievements.user_id, userId),
        eq(userAchievements.achievement_id, achievementId)
      )
    )
    .limit(1);
  return !!existing;
}

async function unlockAchievement(
  userId: number,
  achievementId: string
): Promise<void> {
  if (await hasAchievement(userId, achievementId)) return;

  await db.insert(userAchievements).values({
    user_id: userId,
    achievement_id: achievementId,
  });
}

/**
 * Main function - checks ALL achievements and unlocks them if they are earned
 * @param userId - The ID of the user to check achievements for
 * @param gameData - Optional game data to pass to the achievement checkers
 * @returns An array of achievement IDs that were unlocked
 */

export async function checkAchievements(
  userId: number,
  gameData?: { score: number; opponentScore: number; durationSeconds?: number }
): Promise<string[]> {
  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.user_id, userId))
    .limit(1);

  if (!stats) return [];

  const allAchievements = await db.select().from(achievements);
  const unlocked: string[] = [];

  for (const achievement of allAchievements) {
    if (await hasAchievement(userId, achievement.id)) continue;

    const checker = ACHIEVEMENT_CHECKERS[achievement.id];
    if (!checker) continue; // No checker = skip

    const shouldUnlock = await checker(stats, gameData);
    if (shouldUnlock) {
      await unlockAchievement(userId, achievement.id);
      unlocked.push(achievement.id);
    }
  }

  return unlocked;
}

export async function getAllAchievements() {
  return await db.select().from(achievements);
}

export async function getUserAchievementIds(id: number): Promise<string[]> {
  const results = await db
    .select({ achievement_id: userAchievements.achievement_id })
    .from(userAchievements)
    .where(eq(userAchievements.user_id, id));

  if (results.length === 0) return [];

  return results.map((r) => r.achievement_id);
}
