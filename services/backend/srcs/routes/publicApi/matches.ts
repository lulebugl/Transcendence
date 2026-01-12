import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BlockchainError,
  getMatch,
  getMatches,
  getTotalMatchesCount,
  readContractState,
  Match,
} from "../../blockchain/blockchain";
import { db } from "../../db/client";
import { users, userStats } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import { getPlayerRank, PlayerRank } from "../../utils/player-utils";
import { errorResponse, matchesSchema, EnrichedMatchSchema } from "./matches.schema";

export interface EnrichedMatch extends Match {
  player1Name: string;
  player1Rank: PlayerRank;
  player2Name: string;
  player2Rank: PlayerRank;
  player1Avatar: string;
  player2Avatar: string;
}

export async function enrichMatch(match: Match): Promise<EnrichedMatch> {
  const players = await db
    .select({
      id: users.id,
      username: users.username,
      avatar_url: users.avatar_url,
      level: userStats.level,
    })
    .from(users)
    .leftJoin(userStats, eq(users.id, userStats.user_id))
    .where(inArray(users.id, [match.playerId1, match.playerId2]));

  const player1 = players.find((p) => p.id === match.playerId1);
  const player2 = players.find((p) => p.id === match.playerId2);

  if (!player1 || !player2) {
	throw new Error("Player not found");
  }

  return {
    ...match,
    player1Name: player1.username,
    player1Rank: getPlayerRank(player1.level ?? 1),
    player1Avatar: player1.avatar_url ?? "",
    player2Name: player2.username,
    player2Rank: getPlayerRank(player2.level ?? 1),
    player2Avatar: player2.avatar_url ?? "",
  };
}

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
                description: "Match payload from the blockchain backend",
                ...EnrichedMatchSchema,
              },
            },
            required: ["match"],
          },
          400: {
            description: "Invalid id or bad request",
            ...errorResponse,
          },
          404: {
            description: "Match not found",
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
      req: FastifyRequest<{ Params: MatchParams }>,
      reply: FastifyReply
    ) => {
      const matchId = Number(req.params.id);
      if (!Number.isInteger(matchId) || matchId <= 0) {
        return reply.status(400).send({ error: "Invalid match id" });
      }
      try {
        const match = await getMatch(matchId);
        const enrichedMatch = await enrichMatch(match);
        return { match: enrichedMatch };
      } catch (err) {
        if (err instanceof BlockchainError) {
          if (err.status === 400) {
            return reply.status(400).send({ error: err.message });
          }
          return reply.status(err.status).send({ error: err.message });
        }

        req.log.error({ err }, "Failed to fetch match");
        return reply.status(500).send({ error: "Unable to fetch match" });
      }
    }
  );

  fastify.get(
    "/api/public/matches",
    {
      config: { rateLimit: publicApiRateLimit },	
		schema: matchesSchema,
	},
    async (
      req: FastifyRequest<{ Querystring: PaginationQuery }>,
      reply: FastifyReply
    ) => {
      const offset = Number(req.query.offset ?? 0);
      const count = Number(req.query.count ?? 0);
      if (!Number.isInteger(offset) || offset < 0) {
        return reply.status(400).send({ error: "Invalid offset" });
      }
      if (!Number.isInteger(count) || count < 0 || count > 100) {
        return reply.status(400).send({ error: "Invalid count" });
      }

      try {
        const matches = await getMatches(offset, count);
        const enrichedMatches = await Promise.all(matches.map(enrichMatch));
        return { matches: enrichedMatches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status).send({ error: err.message });
        }
        req.log.error({ err }, "Failed to fetch matches");
        return reply.status(500).send({ error: "Unable to fetch matches" });
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
              state: {
                type: "object",
                additionalProperties: true,
                examples: [
                  {
                    owner: "0x1234...abcd",
                    paused: false,
                    maxMatchesPerPlayer: 100,
                    maxTotalMatches: 10000,
                  },
                ],
              },
            },
            required: ["state"],
          },
          502: {
            description:
              "Blockchain call reverted or upstream blockchain error",
            ...errorResponse,
          },
          500: {
            description: "Unable to fetch state",
            ...errorResponse,
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
        return reply
          .status(500)
          .send({ error: "Unable to fetch contract state" });
      }
    }
  );

  fastify.get(
    "/api/public/matches/totalMatchesCount",
    {
      config: { rateLimit: publicApiRateLimit },
      schema: {
        tags: ["matches"],
        description: "Total number of matches recorded on-chain",
        security: [],
        response: {
          200: {
            description: "Total matches count",
            type: "object",
            properties: {
              totalMatches: { type: "integer" },
            },
            required: ["totalMatches"],
            additionalProperties: false,
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
    async (_req, reply) => {
      try {
        const totalMatches = await getTotalMatchesCount();
        return { totalMatches };
      } catch (err) {
        if (err instanceof BlockchainError) {
          return reply.status(err.status as any).send({ error: err.message });
        }
        reply.log.error({ err }, "Failed to fetch total matches count");
        return reply
          .status(500)
          .send({ error: "Unable to fetch total matches" });
      }
    }
  );
}
