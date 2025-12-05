import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { users, UserStats, userStats } from "../../db/schema";
import { db } from "../../db/client";
import { eq, desc } from "drizzle-orm";

export default async function statsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/users/:id/stats",
    async (
      req: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;

      const [stats] = await db
        .select()
        .from(userStats)
        .where(eq(userStats.user_id, id));

      if (!stats) return reply.notFound("User not found.");
      return stats;
    }
  );

  interface LeaderboardEntryResponse {
    id: number;
    username: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    games_won: number;
    games_lost: number;
  }

  fastify.get<
    { Querystring: { offset: number; limit: number } },
    LeaderboardEntryResponse[]
  >(
    "/api/leaderboard",
    async (
      req: FastifyRequest<{ Querystring: { offset: number; limit: number } }>,
      reply: FastifyReply
    ) => {
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 10;

      if (offset < 0 || limit < 0) {
        return reply.badRequest("Invalid offset or limit.");
      }

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
