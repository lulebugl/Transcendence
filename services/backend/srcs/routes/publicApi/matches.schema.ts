import { FastifySchema } from "fastify";

export const errorResponse = {
  type: "object",
  properties: { error: { type: "string" } },
  required: ["error"],
  additionalProperties: false,
} as const;

export const matchErrorResponses = {
  400: {
    description: "Invalid parameters",
    ...errorResponse,
  },
  502: {
    description: "Blockchain call reverted or upstream blockchain error",
    ...errorResponse,
  },
  500: {
    description: "Unexpected server error",
    ...errorResponse,
  },
} as const;

/** Reusable querystring schema for count parameter */
export const countQuerySchema = {
  type: "object",
  properties: {
    count: { type: "string", description: "Number of matches to return (max 100)" },
  },
} as const;

/** Reusable querystring schema for pagination (offset + count) */
export const paginationQuerySchema = {
  type: "object",
  properties: {
    offset: { type: "string", description: "Number of matches to skip" },
    count: { type: "string", description: "Number of matches to return (max 100)" },
  },
} as const;

// ============================================================================
// Match Schemas
// ============================================================================

export const EnrichedMatchSchema = {
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
    player1Name: { type: "string", examples: ["John"] },
    player2Name: { type: "string", examples: ["Jane"] },
    player1Avatar: {
      type: "string",
      examples: ["https://example.com/avatar1.png"],
    },
    player2Avatar: {
      type: "string",
      examples: ["https://example.com/avatar2.png"],
    },
    player1Rank: {
      type: "string",
      enum: ["Diamond", "Platinum", "Gold", "Silver"],
      examples: ["Gold"],
    },
    player2Rank: {
      type: "string",
      enum: ["Diamond", "Platinum", "Gold", "Silver"],
      examples: ["Silver"],
    },
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
    "player1Name",
    "player2Name",
    "player1Avatar",
    "player2Avatar",
    "player1Rank",
    "player2Rank",
  ],
} as const;

/** Reusable 200 response for matches array */
export const matchesSuccessResponse = (description: string) => ({
  description,
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: EnrichedMatchSchema,
    },
  },
  required: ["matches"],
}) as const;

// ============================================================================
// Route Schemas
// ============================================================================

export const matchesSchema: FastifySchema = {
  tags: ["matches"],
  description: "Paginated list of matches",
  querystring: paginationQuerySchema,
  security: [],
  response: {
    200: matchesSuccessResponse("Matches returned"),
    ...matchErrorResponses,
  },
};

export const latestMatchesSchema: FastifySchema = {
  tags: ["matches"],
  description: "Get the most recent matches",
  querystring: countQuerySchema,
  security: [],
  response: {
    200: matchesSuccessResponse("Latest matches returned"),
    ...matchErrorResponses,
  },
};

export const playerMatchesResponseSchema = {
  200: matchesSuccessResponse("Matches for player returned"),
  ...matchErrorResponses,
} as const;
