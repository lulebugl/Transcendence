import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
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

export default async function publicApiGlobal(fastify: FastifyInstance) {
  if (!fastify.verifyApiKey) {
    throw new Error("verifyApiKey decorator is missing");
  }

  fastify.get(
    "/api/public/global/ping",
    {
      config: {
        rateLimit: publicApiRateLimit,
      },
      schema: {
        tags: ["global"],
      },
    },
    async () => {
      return { pong: true, ts: Date.now() };
    }
  );

  fastify.get(
    "/api/public/global/whoami",
    {
      preHandler: [fastify.verifyApiKey],
      config: {
        rateLimit: publicApiRateLimit,
      },
      schema: {
        tags: ["global"],
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userId = (req as any).apiKeyUserId;
      if (!userId) {
        return reply.internalServerError("Unable to resolve user from API key");
      }

      const [user] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return reply.notFound("User not found");
      }

      return { id: user.id, username: user.username };
    }
  );
}
