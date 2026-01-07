import fp from "fastify-plugin";
import { createHash } from "crypto";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

function hashKey(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
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
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.api_key, keyHash));

      if (!user) {
        req.log.warn("Invalid or revoked API key");
        return reply.unauthorized("Invalid or revoked API key");
      }

      (req as any).apiKeyUserId = user.id;
    }
  );
});

export { hashKey };
