import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BlockchainError,
  getMatch,
  getMatches,
  getPlayerMatchCount,
  getPlayerMatches,
  readContractState,
} from "../../blockchain/blockchain";

const keyByApiKeyOrIp = (req: { headers: any; ip: string }) => {
  const apiKey = req.headers["x-api-key"];
  return Array.isArray(apiKey) ? apiKey.join(",") : apiKey || req.ip;
};

const publicApiRateLimit = {
  max: 50,
  timeWindow: "1 minute",
  keyGenerator: keyByApiKeyOrIp,
};

export default async function publicApiMatches(fastify: FastifyInstance) {
  if (!fastify.verifyApiKey) {
    throw new Error("verifyApiKey decorator is missing");
  }

  interface MatchParams {
    id: string;
  }

  interface PaginationQuery {
    offset?: string;
    count?: string;
  }

  interface PlayerParams {
    playerId: string;
  }

  fastify.get(
    "/api/public/matches/:id",
    {
      config: {
        rateLimit: publicApiRateLimit,
      },
      schema: {
        tags: ["matches"],
        description: "Fetch details for a single match by id",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        security: [],
        response: {
          200: {
            description: "Match found",
            type: "object",
            properties: {
              match: {
                type: "object",
                description: "Match payload from the blockchain backend",
                additionalProperties: true,
              },
            },
            required: ["match"],
          },
          400: {
            description: "Invalid id or bad request",
            type: "object",
            properties: { error: { type: "string" } },
          },
          404: {
            description: "Match not found",
            type: "object",
            properties: { error: { type: "string" } },
          },
          500: {
            description: "Unexpected server error",
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: MatchParams }>,
      reply: FastifyReply
    ) => {
      const matchId = Number(req.params.id);
      if (!Number.isInteger(matchId) || matchId <= 0) {
        return reply.badRequest("Invalid match id");
      }

      try {
        const match = await getMatch(matchId);
        return { match };
      } catch (err) {
        if (err instanceof BlockchainError) {
          if (err.status === 400) {
            return reply.badRequest(err.message);
          }
          return reply.status(err.status).send({ error: err.message });
        }

        req.log.error({ err }, "Failed to fetch match");
        return reply.internalServerError("Unable to fetch match");
      }
    }
  );

  fastify.get(
    "/api/public/matches",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["matches"],
        description: "Paginated list of matches",
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
            description: "Matches returned",
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: { type: "object", additionalProperties: true },
              },
            },
            required: ["matches"],
          },
          400: {
            description: "Invalid pagination parameters",
            type: "object",
            properties: { error: { type: "string" } },
          },
          500: {
            description: "Unexpected server error",
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: PaginationQuery }>,
      reply: FastifyReply
    ) => {
      const offset = Number(req.query.offset ?? 0);
      const count = Number(req.query.count ?? 0);
      if (!Number.isInteger(offset) || offset < 0) {
        return reply.badRequest("Invalid offset");
      }
      if (!Number.isInteger(count) || count < 0 || count > 100) {
        return reply.badRequest("Invalid count");
      }

      try {
        const matches = await getMatches(offset, count);
        return { matches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        req.log.error({ err }, "Failed to fetch matches");
        return reply.internalServerError("Unable to fetch matches");
      }
    }
  );

  fastify.get(
    "/api/public/matches/player/:playerId",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["matches"],
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
                items: { type: "object", additionalProperties: true },
              },
            },
            required: ["matches"],
          },
          400: {
            description: "Invalid player id or pagination",
            type: "object",
            properties: { error: { type: "string" } },
          },
          500: {
            description: "Unexpected server error",
            type: "object",
            properties: { error: { type: "string" } },
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
        return reply.badRequest("Invalid player id");
      }
      if (!Number.isInteger(offset) || offset < 0) {
        return reply.badRequest("Invalid offset");
      }
      if (!Number.isInteger(count) || count < 0 || count > 100) {
        return reply.badRequest("Invalid count");
      }

      try {
        const matches = await getPlayerMatches(playerId, offset, count);
        return { matches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        req.log.error({ err }, "Failed to fetch player matches");
        return reply.internalServerError("Unable to fetch player matches");
      }
    }
  );

  fastify.get(
    "/api/public/matches/state",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["matches"],
        description: "Current on-chain game state snapshot",
        security: [],
        response: {
          200: {
            description: "State fetched",
            type: "object",
            properties: {
              state: { type: "object", additionalProperties: true },
            },
            required: ["state"],
          },
          500: {
            description: "Unable to fetch state",
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (_req, reply) => {
      try {
        const state = await readContractState();
        return { state };
      } catch (err) {
        if (err instanceof BlockchainError) {
		  // @ts-ignore
          return reply.code(err.status).send({ error: err.message });
        }
        reply.log.error({ err }, "Failed to fetch contract state");
        return reply.internalServerError("Unable to fetch contract state");
      }
    }
  );
}
