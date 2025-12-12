// routes/players.ts
import { FastifyInstance, FastifySchema } from "fastify";
import { users, userStats } from "../db/schema";
import { db } from "../db/client";
import { eq, desc, count, gt } from "drizzle-orm";
import { fields } from "./schema";

const MAX_LIMIT_LEADERBOARD = 100;

// ─── Schemas ───────────────────────────────────────────
const profileParamsSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["username"],
    properties: {
      username: { ...fields.username },
    },
  },
};

const leaderboardQuerySchema: FastifySchema = {
  querystring: {
    type: "object",
    properties: {
      offset: { type: "integer", minimum: 0, default: 0 },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: MAX_LIMIT_LEADERBOARD,
        default: 10,
      },
    },
  },
};

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

  // Get leaderboard
  fastify.get<{ Querystring: { offset?: number; limit?: number } }>(
    "/api/leaderboard",
    { schema: leaderboardQuerySchema },
    async (req) => {
      const offset = req.query.offset ?? 0;
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
