import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BlockchainError,
  getPlayerMatches,
  getPlayerMatchCount,
} from "../../blockchain/blockchain";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

const keyByApiKeyOrIp = (req: { headers: any; ip: string }) => {
  const apiKey = req.headers["x-api-key"];
  return Array.isArray(apiKey) ? apiKey.join(",") : apiKey || req.ip;
};

const publicApiRateLimit = {
  max: 50,
  timeWindow: "1 minute",
  keyGenerator: keyByApiKeyOrIp,
};

const errorResponse = {
  type: "object",
  properties: { error: { type: "string" } },
  required: ["error"],
  additionalProperties: false,
} as const;

const matchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "integer", examples: [1] },
    playerId1: { type: "integer", examples: [7] },
    playerId2: { type: "integer", examples: [13] },
    score1: { type: "integer", examples: [21] },
    score2: { type: "integer", examples: [19] },
    expGained1: { type: "integer", examples: [120] },
    expGained2: { type: "integer", examples: [95] },
    timestamp: { type: "integer", examples: [1712345678] },
    winner: { type: ["integer", "null"], examples: [7] },
  },
  required: [
    "id",
    "playerId1",
    "playerId2",
    "score1",
    "score2",
    "expGained1",
    "expGained2",
    "timestamp",
  ],
} as const;

export default async function publicApiPlayers(fastify: FastifyInstance) {
  if (!fastify.verifyApiKey) {
    throw new Error("verifyApiKey decorator is missing");
  }

  interface PlayerParams {
    playerId: string;
  }

  interface PaginationQuery {
    offset?: string;
    count?: string;
  }

  fastify.get(
    "/api/public/players/:playerId/matches",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["players"],
        description: "Paginated matches for a given player",
        params: {
          type: "object",
          properties: {
            playerId: { type: "string" },
          },
          required: ["playerId"],
        },
        querystring: {
          type: "object",
          properties: {
            offset: { type: "string" },
            count: { type: "string" },
          },
        },
        security: [],
        response: {
          200: {
            description: "Matches for player returned",
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: matchSchema,
                examples: [
                  [
                    {
                      id: 2,
                      playerId1: 7,
                      playerId2: 15,
                      score1: 11,
                      score2: 5,
                      expGained1: 80,
                      expGained2: 40,
                      timestamp: 1712345689,
                      winner: 7,
                    },
                  ],
                ],
              },
            },
            required: ["matches"],
          },
          400: {
            description: "Invalid player id or pagination",
            ...errorResponse,
          },
          502: {
            description:
              "Blockchain call reverted or upstream blockchain error",
            ...errorResponse,
          },
          500: {
            description: "Unexpected server error",
            ...errorResponse,
          },
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: PlayerParams;
        Querystring: PaginationQuery;
      }>,
      reply: FastifyReply
    ) => {
      const playerId = Number(req.params.playerId);
      const offset = Number(req.query.offset ?? 0);
      const count = Number(req.query.count ?? 0);
      if (!Number.isInteger(playerId) || playerId <= 0) {
        return reply.status(400).send({ error: "Invalid player id" });
      }
      if (!Number.isInteger(offset) || offset < 0) {
        return reply.status(400).send({ error: "Invalid offset" });
      }
      if (!Number.isInteger(count) || count < 0 || count > 100) {
        return reply.status(400).send({ error: "Invalid count" });
      }

      try {
        const matches = await getPlayerMatches(playerId, offset, count);
        return { matches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        req.log.error({ err }, "Failed to fetch player matches");
        return reply
          .status(500)
          .send({ error: "Unable to fetch player matches" });
      }
    }
  );

  fastify.get(
    "/api/public/players/:playerId/name",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["players"],
        description: "Fetch username for the given player id",
        params: {
          type: "object",
          properties: {
            playerId: { type: "string" },
          },
          required: ["playerId"],
        },
        security: [],
        response: {
          200: {
            description: "Username resolved",
            type: "object",
            properties: {
              username: { type: "string" },
            },
            required: ["username"],
            additionalProperties: false,
          },
          400: {
            description: "Invalid player id",
            ...errorResponse,
          },
          404: {
            description: "Player not found",
            ...errorResponse,
          },
          500: {
            description: "Unexpected server error",
            ...errorResponse,
          },
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: PlayerParams }>,
      reply: FastifyReply
    ) => {
      const playerId = Number(req.params.playerId);
      if (!Number.isInteger(playerId) || playerId <= 0) {
        return reply.status(400).send({ error: "Invalid player id" });
      }

      try {
        const [user] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, playerId));

        if (!user) {
          return reply.status(404).send({ error: "Player not found" });
        }

        return { username: user.username };
      } catch (err) {
        req.log.error({ err }, "Failed to fetch player username");
        return reply
          .status(500)
          .send({ error: "Unable to fetch player username" });
      }
    }
  );

  fastify.get(
    "/api/public/players/:playerId/totalMatchesCount",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["players"],
        description: "Total matches count for a given player",
        params: {
          type: "object",
          properties: {
            playerId: { type: "string" },
          },
          required: ["playerId"],
        },
        security: [],
        response: {
          200: {
            description: "Total matches count for player",
            type: "object",
            properties: {
              totalMatches: { type: "integer" },
            },
            required: ["totalMatches"],
            additionalProperties: false,
          },
          400: {
            description: "Invalid player id",
            ...errorResponse,
          },
          502: {
            description:
              "Blockchain call reverted or upstream blockchain error",
            ...errorResponse,
          },
          500: {
            description: "Unexpected server error",
            ...errorResponse,
          },
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: PlayerParams;
      }>,
      reply: FastifyReply
    ) => {
      const playerId = Number(req.params.playerId);
      if (!Number.isInteger(playerId) || playerId <= 0) {
        return reply.status(400).send({ error: "Invalid player id" });
      }

      try {
        const totalMatches = await getPlayerMatchCount(playerId);
        return { totalMatches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        req.log.error({ err }, "Failed to fetch player match count");
        return reply
          .status(500)
          .send({ error: "Unable to fetch player match count" });
      }
    }
  );
}
