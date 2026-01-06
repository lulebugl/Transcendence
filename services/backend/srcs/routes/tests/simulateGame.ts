import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { updatePostGameStats } from "../../pong/gameCompletion";
import { checkAchievements } from "../achievements/achievements-utils";

interface SimulateGameBody {
  player1Username: string;
  player2Username: string;
  player1Score: number;
  player2Score: number;
}

const SimulateGameSchema = {
  body: {
    type: "object",
    required: ["player1Username", "player2Username", "player1Score", "player2Score"],
    properties: {
      player1Username: { type: "string" },
      player2Username: { type: "string" },
      player1Score: { type: "number", minimum: 0 },
      player2Score: { type: "number", minimum: 0 },
    },
    additionalProperties: false,
  },
};

const GAME_DURATION_SECONDS = 119;

export default async function simulateGameRoutes(fastify: FastifyInstance) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  fastify.post<{ Body: SimulateGameBody }>(
    "/api/test/simulate-game",
    {
      schema: SimulateGameSchema,
    },
    async (request: FastifyRequest<{ Body: SimulateGameBody }>, reply: FastifyReply) => {
      const { player1Username, player2Username, player1Score, player2Score } = request.body;

      // Look up player IDs from usernames
      const [player1] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, player1Username));

      const [player2] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, player2Username));

      if (!player1) {
        return reply.notFound(`Player 1 not found: ${player1Username}`);
      }

      if (!player2) {
        return reply.notFound(`Player 2 not found: ${player2Username}`);
      }

      if (player1.id === player2.id) {
        return reply.badRequest("Player 1 and Player 2 must be different users");
      }

      const result = await updatePostGameStats({
        player1Id: player1.id,
        player2Id: player2.id,
        player1Score,
        player2Score,
      });

      await checkAchievements(player1.id, {
        score: player1Score,
        opponentScore: player2Score,
        durationSeconds: GAME_DURATION_SECONDS,
      });

      await checkAchievements(player2.id, {
        score: player2Score,
        opponentScore: player1Score,
        durationSeconds: GAME_DURATION_SECONDS,
      });

      return {
        success: true,
        message: "Game simulated successfully",
        player1: { id: player1.id, username: player1Username, score: player1Score },
        player2: { id: player2.id, username: player2Username, score: player2Score },
        xpResult: result,
      };
    }
  );
}
