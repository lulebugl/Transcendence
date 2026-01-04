import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomBytes } from "crypto";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashKey } from "../utils/apiKey";

interface CreateApiKeyBody {
  label?: string;
}

function generateRawApiKey(): string {
  return randomBytes(32).toString("hex");
}

export default async function apiKeyRoutes(fastify: FastifyInstance) {
  // GET - check if current user has at least one active API key
  fastify.get(
    "/api/api-keys/has",
    { preHandler: fastify.auth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const [existing] = await db
        .select({ api_key: users.api_key })
        .from(users)
        .where(eq(users.id, req.user.id))
        .limit(1);

      if (!existing) {
        return reply.notFound("User not found");
      }

      return { hasKey: !!existing.api_key };
    }
  );

  // POST - create a new API key and return the raw key once
  fastify.post(
    "/api/api-keys",
    { preHandler: fastify.auth },
    async (
      req: FastifyRequest<{ Body: CreateApiKeyBody }>,
      reply: FastifyReply
    ) => {
      const label = req.body?.label?.trim() || null;

      const rawKey = generateRawApiKey();
      const keyHash = hashKey(rawKey);

      try {
        await db
          .update(users)
          .set({ api_key: keyHash })
          .where(eq(users.id, req.user.id));

        return {
          id: req.user.id,
          label,
          created_at: new Date().toISOString(),
          apiKey: rawKey,
        };
      } catch (err) {
        req.log.error({ err }, "Failed to create API key");
        return reply.internalServerError("Unable to create API key");
      }
    }
  );

  // POST - regenerate and return a fresh API key
  fastify.post(
    "/api/api-keys/regenerate",
    { preHandler: fastify.auth },
    async (req: FastifyRequest<{ Body: CreateApiKeyBody }>, reply) => {
      const label = req.body?.label?.trim() || null;

      const rawKey = generateRawApiKey();
      const keyHash = hashKey(rawKey);

      try {
        await db
          .update(users)
          .set({ api_key: keyHash })
          .where(eq(users.id, req.user.id));

        return {
          id: req.user.id,
          label,
          created_at: new Date().toISOString(),
          apiKey: rawKey,
        };
      } catch (err) {
        req.log.error({ err }, "Failed to regenerate API key");
        return reply.internalServerError("Unable to regenerate API key");
      }
    }
  );

  // POST - revoke an existing key (alias to DELETE)
  fastify.post(
    "/api/api-keys/revoke",
    { preHandler: fastify.auth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await db
          .update(users)
          .set({ api_key: null })
          .where(eq(users.id, req.user.id));

        return { success: true };
      } catch (err) {
        req.log.error({ err }, "Failed to revoke API key");
        return reply.internalServerError("Unable to revoke API key");
      }
    }
  );

  // DELETE - remove the current API key
  fastify.delete(
    "/api/api-keys",
    { preHandler: fastify.auth },
    async (req: FastifyRequest) => {
      await db
        .update(users)
        .set({ api_key: null })
        .where(eq(users.id, req.user.id));

      return { success: true };
    }
  );
}
