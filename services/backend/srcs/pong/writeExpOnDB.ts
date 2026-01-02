import { db } from "../db/client";
import { eq } from "drizzle-orm";
import { users, userStats } from "../db/schema";
// working in progress is just for try
export async function updatePlayerXp(playerId: number, xpGain: number) {
    await db.update(userStats).set({ xp: userStats.xp + xpGain }).where(eq(userStats.user_id, playerId));
}

export async function getPlayerXp(playerId: number): Promise<number> {
    const result = await db
        .select({ xp: userStats.xp })
        .from(userStats)
        .where(eq(userStats.user_id, playerId))
        .limit(1);
    return result[0]?.xp ?? 0;
}