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
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
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
        querystring: {
          type: "object",
          properties: {
            offset: { type: "string" },
            count: { type: "string" },
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
      },
    },
    async (_req, reply) => {
      try {
        const state = await readContractState();
        return { state };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        reply.log.error({ err }, "Failed to fetch contract state");
        return reply.internalServerError("Unable to fetch contract state");
      }
    }
  );
}
