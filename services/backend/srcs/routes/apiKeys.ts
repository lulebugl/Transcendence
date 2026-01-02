import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomBytes } from "crypto";
import { db } from "../db/client";
import { apiKeys } from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { hashKey } from "../utils/apiKey";

interface CreateApiKeyBody {
  label?: string;
}

interface ApiKeyParams {
  id: string;
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
        .select({ id: apiKeys.id })
        .from(apiKeys)
        .where(
          and(eq(apiKeys.user_id, req.user.id), isNull(apiKeys.revoked_at))
        )
        .limit(1);

      return { hasKey: !!existing };
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
        const [inserted] = await db
          .insert(apiKeys)
          .values({
            user_id: req.user.id,
            key_hash: keyHash,
            label,
          })
          .returning({
            id: apiKeys.id,
            label: apiKeys.label,
            created_at: apiKeys.created_at,
          });

        return {
          id: inserted.id,
          label: inserted.label,
          created_at: inserted.created_at,
          apiKey: rawKey,
        };
      } catch (err) {
        req.log.error({ err }, "Failed to create API key");
        return reply.internalServerError("Unable to create API key");
      }
    }
  );

  // POST - revoke an active key
  fastify.post(
    "/api/api-keys/:id/revoke",
    { preHandler: fastify.auth },
    async (
      req: FastifyRequest<{ Params: ApiKeyParams }>,
      reply: FastifyReply
    ) => {
      const keyId = Number(req.params.id);
      if (!Number.isInteger(keyId)) {
        return reply.badRequest("Invalid API key id");
      }

      const [revoked] = await db
        .update(apiKeys)
        .set({ revoked_at: new Date() })
        .where(
          and(
            eq(apiKeys.id, keyId),
            eq(apiKeys.user_id, req.user.id),
            isNull(apiKeys.revoked_at)
          )
        )
        .returning({ id: apiKeys.id, revoked_at: apiKeys.revoked_at });

      if (!revoked) {
        return reply.notFound("API key not found or already revoked");
      }

      return { success: true, revoked_at: revoked.revoked_at };
    }
  );

  // POST - revoke existing active key and create a fresh one with same label
  fastify.post(
    "/api/api-keys/:id/regenerate",
    { preHandler: fastify.auth },
    async (
      req: FastifyRequest<{ Params: ApiKeyParams }>,
      reply: FastifyReply
    ) => {
      const keyId = Number(req.params.id);
      if (!Number.isInteger(keyId)) {
        return reply.badRequest("Invalid API key id");
      }

      const [existing] = await db
        .select({ id: apiKeys.id, label: apiKeys.label })
        .from(apiKeys)
        .where(
          and(
            eq(apiKeys.id, keyId),
            eq(apiKeys.user_id, req.user.id),
            isNull(apiKeys.revoked_at)
          )
        );

      if (!existing) {
        return reply.notFound("API key not found or already revoked");
      }

      await db
        .update(apiKeys)
        .set({ revoked_at: new Date() })
        .where(eq(apiKeys.id, existing.id));

      const rawKey = generateRawApiKey();
      const keyHash = hashKey(rawKey);

      try {
        const [created] = await db
          .insert(apiKeys)
          .values({
            user_id: req.user.id,
            key_hash: keyHash,
            label: existing.label,
          })
          .returning({
            id: apiKeys.id,
            label: apiKeys.label,
            created_at: apiKeys.created_at,
          });

        return {
          previousId: existing.id,
          id: created.id,
          label: created.label,
          created_at: created.created_at,
          apiKey: rawKey,
        };
      } catch (err) {
        req.log.error({ err }, "Failed to regenerate API key");
        return reply.internalServerError("Unable to regenerate API key");
      }
    }
  );

  // POST - delete an active key
  fastify.delete(
    "/api/api-keys",
    { preHandler: fastify.auth },
    async (
      req: FastifyRequest
    ) => {
      await db
        .delete(apiKeys)
        .where(eq(apiKeys.user_id, req.user.id));

      return { success: true };
    }
	);
}
