import { checkAchievements } from "../routes/achievements/achievements-utils";
import { db } from "./client";
import { eq } from "drizzle-orm";
import { achievements, userAchievements, users, userStats } from "./schema";
import { hashKey } from "../utils/apiKey";
import { hash } from "argon2";

// prettier-ignore
const SEED_USERS = [
  { username: 'test1', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeoPaddle' },
  { username: 'ShadowPaddle', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { username: 'NeonStrike', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { username: 'CyberServe', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  { username: 'PixelMaster', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  { username: 'VoidSmasher', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
  { username: 'QuantumAce', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
  { username: 'ByteRunner', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
  { username: 'GlitchKing', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
];

// prettier-ignore
const SEED_STATS = [
  { games_played: 500, games_won: 500, tournaments_won: 10, level: 42, xp: 18500, current_win_streak: 12, best_win_streak: 18 },
  { games_played: 120, games_won: 105, tournaments_won: 5, level: 31, xp: 8500, current_win_streak: 12, best_win_streak: 18 },
  { games_played: 95, games_won: 78, tournaments_won: 3, level: 28, xp: 6200, current_win_streak: 5, best_win_streak: 14 },
  { games_played: 80, games_won: 63, tournaments_won: 3, level: 22, xp: 5100, current_win_streak: 3, best_win_streak: 10 },
  { games_played: 65, games_won: 48, tournaments_won: 2, level: 15, xp: 4000, current_win_streak: 0, best_win_streak: 8 },
  { games_played: 50, games_won: 35, tournaments_won: 1, level: 14, xp: 3200, current_win_streak: 2, best_win_streak: 7 },
  { games_played: 40, games_won: 25, tournaments_won: 0, level: 12, xp: 2400, current_win_streak: 0, best_win_streak: 5 },
  { games_played: 30, games_won: 15, tournaments_won: 0, level: 7, xp: 1600, current_win_streak: 1, best_win_streak: 4 },
  { games_played: 11, games_won: 8, tournaments_won: 0, level: 3, xp: 150, current_win_streak: 0, best_win_streak: 3 },
];

// prettier-ignore
const SEED_ACHIEVEMENTS = [
	{ id: "first_blood", name: "First Blood", description: "Win your first match", rarity: "common" as const },
	{ id: "hot_streak", name: "Hot Streak", description: "Win 5 matches in a row", rarity: "rare" as const },
	{ id: "perfectionist", name: "Perfectionist", description: "Win a match 11-0", rarity: "epic" as const },
	{ id: "tournament_victor", name: "Tournament Victor", description: "Win a tournament", rarity: "legendary" as const },
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
