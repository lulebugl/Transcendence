import { db } from "./client";
import { achievements } from "./schema";

// prettier-ignore
export const SEED_ACHIEVEMENTS = [
	{ id: "first_blood", name: "First Blood", description: "Win your first match", rarity: "common" as const },
	{ id: "hot_streak", name: "Hot Streak", description: "Win 5 matches in a row", rarity: "rare" as const },
	{ id: "perfectionist", name: "Perfectionist", description: "Win a match 11-0", rarity: "legendary" as const },
	{ id: "grinder", name: "Grinder", description: "Reach level 30", rarity: "epic" as const },
	{ id: "centurion", name: "Centurion", description: "Play 100 matches", rarity: "rare" as const },
	{ id: "speed_demon", name: "Speed Demon", description: "Win in under 2 minutes", rarity: "epic" as const },
];

export async function seedAchievements() {
  console.log("🌱 Seeding achievements...");

  await db.delete(achievements);
  await db.insert(achievements).values(SEED_ACHIEVEMENTS);

  console.log("✅ Inserted", SEED_ACHIEVEMENTS.length, "achievements");
}

seedAchievements().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
