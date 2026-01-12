import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BlockchainError,
  getPlayerMatches,
  getPlayerMatchCount,
} from "../../blockchain/blockchain";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  errorResponse,
  playerMatchesResponseSchema,
} from "./matches.schema";
import { type EnrichedMatch, enrichMatch } from "./matches";

const keyByApiKeyOrIp = (req: { headers: any; ip: string }) => {
  const apiKey = req.headers["x-api-key"];
  return Array.isArray(apiKey) ? apiKey.join(",") : apiKey || req.ip;
};

const publicApiRateLimit = {
  max: 50,
  timeWindow: "1 minute",
  keyGenerator: keyByApiKeyOrIp,
};

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
        response: { ...playerMatchesResponseSchema },
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
		// retrieve the matches from the blockchain
		// then enrich the matches with the player data (username, rank, avatar...)
		// and logs and filters out corrupted matches

        const matches = await getPlayerMatches(playerId, offset, count);
		const results = await Promise.allSettled(matches.map(enrichMatch));
        const enrichedMatches = results
          .filter((result): result is PromiseFulfilledResult<EnrichedMatch> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);
        
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            req.log.warn({ 
              match: matches[index], 
              error: result.reason 
            }, 'Skipping match with missing players');
          }
        });
        return { matches: enrichedMatches };
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
