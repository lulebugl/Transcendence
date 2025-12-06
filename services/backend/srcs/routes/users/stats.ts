import { FastifyInstance, FastifySchema } from "fastify";
import { users, userStats } from "../../db/schema";
import { db } from "../../db/client";
import { eq, desc } from "drizzle-orm";

const MAX_LIMIT_LEADERBOARD = 100;

const StatsParamsSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 },
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

async function fetchUserStatsRow(id: number) {
  const [row] = await db
    .select({
      user_id: userStats.user_id,
      username: users.username,
      avatar_url: users.avatar_url,
      level: userStats.level,
      xp: userStats.xp,
      games_won: userStats.games_won,
      games_lost: userStats.games_lost,
      best_win_streak: userStats.best_win_streak,
      tournaments_won: userStats.tournaments_won,
    })
    .from(userStats)
    .innerJoin(users, eq(userStats.user_id, users.id))
    .where(eq(userStats.user_id, id));
  return row;
}

export default async function statsRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: number } }>(
    "/api/users/:id/stats",
    { schema: StatsParamsSchema },
    async (req, reply) => {
      const { id } = req.params;
      const stats = await fetchUserStatsRow(id);
      if (!stats) return reply.notFound("User not found.");

      return stats;
    }
  );

  fastify.get<{ Querystring: { offset?: number; limit?: number } }>(
    "/api/leaderboard",
    { schema: leaderboardQuerySchema },
    async (req, reply) => {
      const offset = req.query.offset ?? 0;
      const limit = Math.min(req.query.limit ?? 10, MAX_LIMIT_LEADERBOARD);

      const leaderboard = await db
        .select({
          id: userStats.id,
          username: users.username,
          avatar_url: users.avatar_url,
          level: userStats.level,
          xp: userStats.xp,
          games_won: userStats.games_won,
          games_lost: userStats.games_lost,
        })
        .from(userStats)
        .innerJoin(users, eq(userStats.user_id, users.id))
        .orderBy(desc(userStats.xp))
        .limit(limit)
        .offset(offset);

      return leaderboard;
    }
  );
}
