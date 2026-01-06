import { checkAchievements } from "../routes/achievements/achievements-utils";
import { db } from "./client";
import { eq } from "drizzle-orm";
import { achievements, userAchievements, users, userStats } from "./schema";
import { hashKey } from "../utils/apiKey";
import { hash } from "argon2";
import { xpForLevel } from "../pong/expCounter";

// prettier-ignore
const SEED_USERS = [
  { username: 'test1', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeoPaddle', email: "test1@mail.com" },
  { username: 'ShadowPaddle', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', email: "test2@mail.com" },
  { username: 'NeonStrike', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', email: "test3@mail.com" },
  { username: 'CyberServe', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', email: "test4@mail.com" },
  { username: 'PixelMaster', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', email: "test5@mail.com" },
  { username: 'VoidSmasher', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', email: "test6@mail.com" },
  { username: 'QuantumAce', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', email: "test7@mail.com" },
  { username: 'ByteRunner', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', email: "test8@mail.com" },
  { username: 'GlitchKing', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', email: "test9@mail.com" },
];

/**
 * Calculates XP into current level based on percentage progress
 * @param level - The player's level
 * @param percentage - Progress through the level (0.0 to 1.0, e.g., 0.5 = 50%)
 * @returns XP into the current level
 */
function levelProgress(level: number, percentage: number): number {
	const currentLevelXp = xpForLevel(level);
	const nextLevelXp = xpForLevel(level + 1);
	const levelRange = nextLevelXp - currentLevelXp;
	const result = Math.floor(levelRange * percentage);
	return result;
  }
  
// prettier-ignore
const SEED_STATS = [
  { games_played: 500, games_won: 500, level: 42, xp: levelProgress(42, 0.5), current_win_streak: 18, best_win_streak: 18 },
  { games_played: 120, games_won: 105, level: 31, xp: levelProgress(31, 0.4), current_win_streak: 3, best_win_streak: 3 },
  { games_played: 95, games_won: 78, level: 28, xp: levelProgress(28, 0.4), current_win_streak: 5, best_win_streak: 14 },
  { games_played: 80, games_won: 63, level: 22, xp: levelProgress(22, 0.3), current_win_streak: 3, best_win_streak: 10 },
  { games_played: 65, games_won: 48, level: 15, xp: levelProgress(15, 0.5), current_win_streak: 0, best_win_streak: 8 },
  { games_played: 50, games_won: 35, level: 14, xp: levelProgress(14, 0.9), current_win_streak: 2, best_win_streak: 7 },
  { games_played: 40, games_won: 25, level: 12, xp: levelProgress(12, 0.7), current_win_streak: 0, best_win_streak: 5 },
  { games_played: 30, games_won: 15, level: 7, xp: levelProgress(7, 0.8), current_win_streak: 1, best_win_streak: 4 },
  { games_played: 11, games_won: 8, level: 3, xp: levelProgress(3, 0.9), current_win_streak: 0, best_win_streak: 3 },
];

// prettier-ignore
const SEED_ACHIEVEMENTS = [
	{ id: "first_blood", name: "First Blood", description: "Win your first match", rarity: "common" as const },
	{ id: "hot_streak", name: "Hot Streak", description: "Win 5 matches in a row", rarity: "rare" as const },
	{ id: "perfectionist", name: "Perfectionist", description: "Win a match 11-0", rarity: "legendary" as const },
	{ id: "grinder", name: "Grinder", description: "Reach level 30", rarity: "epic" as const },
	{ id: "centurion", name: "Centurion", description: "Play 100 matches", rarity: "rare" as const },
	{ id: "speed_demon", name: "Speed Demon", description: "Win in under 2 minutes", rarity: "epic" as const },
];

async function seed() {
  console.log("🌱 Seeding database...");

  await db.delete(userStats);
  await db.delete(users);
  await db.delete(achievements);
  await db.delete(userAchievements);

  const testPasswordHash = await hash("test1234");
  const insertedUsers = await db
    .insert(users)
    .values(
      SEED_USERS.map((user) => ({
        ...user,
        password_hash: testPasswordHash,
      }))
    )
    .returning();

  console.log(`✅ Inserted ${insertedUsers.length} users`);

  const insertedStats = await db
    .insert(userStats)
    .values(
      insertedUsers.map((user, index) => ({
        user_id: user.id,
        games_lost:
          SEED_STATS[index].games_played - SEED_STATS[index].games_won,
        ...SEED_STATS[index],
      }))
    )
    .returning();
  console.log(`✅ Inserted ${insertedStats.length} user stats`);

  // Insert achievements
  await db.insert(achievements).values(SEED_ACHIEVEMENTS);
  console.log(`✅ Inserted ${SEED_ACHIEVEMENTS.length} achievements`);

  console.log("...Unlocking achievements for players...");
  await Promise.all(
    insertedUsers.map(async (user) => {
      await checkAchievements(user.id);
    })
  );

  const test1 = insertedUsers.find((user) => user.username === "test1");
  if (test1) {
    const rawKey =
      "526bd5fa09af414c98cb304016a0922eff6ea2ee9a6d3a1b818960cc10cb6abf";
    const keyHash = hashKey(rawKey);
    await db
      .update(users)
      .set({ api_key: keyHash })
      .where(eq(users.id, test1.id));
    console.log(`🔑 API key for test1: ${rawKey}`);
  }

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
