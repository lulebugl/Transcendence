import fp from "fastify-plugin";
import { createHash } from "crypto";
import { db } from "../db/client";
import { apiKeys } from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

function hashKey(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

async function touchLastUsed(apiKeyId: number) {
  try {
    await db
      .update(apiKeys)
      .set({ last_used_at: new Date() })
      .where(eq(apiKeys.id, apiKeyId));
  } catch (err) {
    // best-effort, do not block the request on metrics failure
  }
}

export default fp(async function apiKeyPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "verifyApiKey",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const provided = req.headers["x-api-key"];
      if (!provided || Array.isArray(provided)) {
        req.log.warn("Missing API key on public endpoint");
        return reply.unauthorized("Missing API key");
      }

      const keyHash = hashKey(provided);
      const [key] = await db
        .select({ id: apiKeys.id, user_id: apiKeys.user_id })
        .from(apiKeys)
        .where(and(eq(apiKeys.key_hash, keyHash), isNull(apiKeys.revoked_at)));

      if (!key) {
        req.log.warn("Invalid or revoked API key");
        return reply.unauthorized("Invalid or revoked API key");
      }

      touchLastUsed(key.id);

      (req as any).apiKeyId = key.id;
      (req as any).apiKeyUserId = key.user_id;
    }
  );
});

export { hashKey };
