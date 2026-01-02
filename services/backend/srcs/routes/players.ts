// routes/players.ts
import { FastifyInstance, FastifySchema } from "fastify";
import { users, userStats } from "../db/schema";
import { db } from "../db/client";
import { eq, desc, count, gt } from "drizzle-orm";
import { fields } from "./schema";
import {
  profileParamsSchema,
  levelParamsSchema,
  leaderboardQuerySchema,
  MAX_LIMIT_LEADERBOARD,
} from "./players.schema";
import { getPlayerRank } from "../utils/player-utils";

// ─── Helpers ───────────────────────────────────────────
export async function initPlayerStats(userId: number) {
  await db
    .insert(userStats)
    .values({
      user_id: userId,
      level: 1,
      xp: 0,
      games_won: 0,
      games_lost: 0,
      best_win_streak: 0,
    })
    .returning();
}

async function fetchPlayerProfile(username: string) {
  const [row] = await db
    .select({
      userId: userStats.user_id,
      username: users.username,
      avatarUrl: users.avatar_url,
      lastCall: users.last_call,
      level: userStats.level,
      xp: userStats.xp,
      gamesWon: userStats.games_won,
      gamesLost: userStats.games_lost,
      bestWinStreak: userStats.best_win_streak,
      tournamentsWon: userStats.tournaments_won,
      memberSince: users.created_at,
    })
    .from(userStats)
    .innerJoin(users, eq(userStats.user_id, users.id))
    .where(eq(users.username, username));

  if (!row) return null;

  const [rankResult] = await db
    .select({ count: count() })
    .from(userStats)
    .where(gt(userStats.xp, row.xp));
  return { ...row, globalRank: rankResult.count + 1 };
}

async function fetchPlayerLevel(username: string) {
  const [row] = await db
    .select({ level: userStats.level })
    .from(userStats)
    .innerJoin(users, eq(userStats.user_id, users.id))
    .where(eq(users.username, username));
  return row?.level;
}

async function fetchPlayerRank(username: string) {
  const [row] = await db
    .select({ level: userStats.level })
    .from(userStats)
    .innerJoin(users, eq(userStats.user_id, users.id))
    .where(eq(users.username, username));
  if (!row) return null;
  return getPlayerRank(row.level);
}
// ─── Routes ────────────────────────────────────────────
export default async function playersRoutes(fastify: FastifyInstance) {
  // Get a player's profile
  fastify.get<{ Params: { username: string } }>(
    "/api/users/:username/profile",
    { schema: profileParamsSchema },
    async (req, reply) => {
      const profile = await fetchPlayerProfile(req.params.username);
      if (!profile) return reply.notFound("User not found.");
      return profile;
    }
  );

  fastify.get<{ Params: { username: string } }>(
    "/api/users/:username/level",
    { schema: levelParamsSchema },
    async (req, reply) => {
      const level = await fetchPlayerLevel(req.params.username);
      if (!level) return reply.notFound("User not found.");
      return level;
    }
  );

  fastify.get<{ Params: { username: string } }>(
    "/api/users/:username/rank",
    { schema: levelParamsSchema },
    async (req, reply) => {
      const rank = await fetchPlayerRank(req.params.username);
      if (!rank) return reply.notFound("User not found.");
      return rank;
    }
  );

  // Get leaderboard
  fastify.get<{ Querystring: { offset?: number; limit?: number } }>(
    "/api/leaderboard",
    { schema: leaderboardQuerySchema },
    async (req) => {
      const offset = req.query.offset ?? 0;

	  // this is just a security measure
	  // but the request should reach this if it hits limit 
      const limit = Math.min(req.query.limit ?? 10, MAX_LIMIT_LEADERBOARD);

      return db
        .select({
          user_id: users.id,
          username: users.username,
          avatarUrl: users.avatar_url,
          lastCall: users.last_call,
          level: userStats.level,
          xp: userStats.xp,
          gamesWon: userStats.games_won,
          gamesLost: userStats.games_lost,
        })
        .from(userStats)
        .innerJoin(users, eq(userStats.user_id, users.id))
        .orderBy(desc(userStats.xp))
        .limit(limit)
        .offset(offset);
    }
  );
}
