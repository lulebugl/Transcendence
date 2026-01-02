import { FastifySchema } from "fastify";
import { fields } from "./schema";

const MAX_LIMIT_LEADERBOARD = 100;

const profileParamsSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["username"],
    properties: {
      username: { ...fields.username },
    },
  },
};

const levelParamsSchema: FastifySchema = {
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

export { profileParamsSchema, levelParamsSchema, leaderboardQuerySchema, MAX_LIMIT_LEADERBOARD };
