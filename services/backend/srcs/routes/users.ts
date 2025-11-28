import { db } from "../db/client";
import { users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import "dotenv/config";
import dotenv from "dotenv";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { fields } from "./schema";
import { hashPassword, verifyPassword } from "../utils/hash";

dotenv.config();

interface UserQuery {
  offset?: number;
  limit?: number;
}

interface UpdateProfileBody {
  username?: string;
  avatar_url?: string;
}

const UpdateProfileSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      username: { ...fields.username },
      avatar_url: { ...fields.url },
    },
    additionalProperties: false,
  },
};

const ChangePasswordSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["current", "new"],
    properties: {
      current: { ...fields.password },
      new: { ...fields.password },
    },
  },
};
export default async function userRoutes(fastify: FastifyInstance) {
  // GET - Retrieve current user
  fastify.get(
    "/api/users/me",
    { preHandler: fastify.auth },
    async (req: FastifyRequest) => {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          avatar_url: users.avatar_url,
          totp_secret_key: users.totp_secret_key,
        })
        .from(users)
        .where(eq(users.id, req.user.id));

      if (!user) return fastify.httpErrors.notFound("User not found");

      const { totp_secret_key, ...userProfile } = user;

      return { ...userProfile, totp_enabled: !!totp_secret_key };
    }
  );

  // GET - Retrieve users by pages with offset and limit
  fastify.get(
    "/api/users",
    async (req: FastifyRequest<{ Querystring: UserQuery }>) => {
      const { offset = 0, limit = 10 } = req.query;
      return await db.select().from(users).limit(limit).offset(offset);
    }
  );

  fastify.patch<{ Body: UpdateProfileBody }>(
    "/api/users/update",
    {
      schema: UpdateProfileSchema,
      preHandler: fastify.auth,
    },
    async (req, reply) => {
      const userId = req.user.id;
      const { username, avatar_url } = req.body;

      // can this happen? i don't think so based on schema
      if (!username && !avatar_url) {
        return reply.badRequest("No fields to update");
      }

      if (username) {
        const [existing] = await db
          .select({ id: users.id })
          .from(users)
          .where(and(eq(users.username, username), ne(users.id, userId)));

        if (existing) {
          return reply.conflict("Username already used");
        }
      }

      const updateData: Partial<{
        username: string;
        avatar_url: string;
        updated_at: Date;
      }> = {
        updated_at: new Date(),
      };

      if (username) updateData.username = username;
      if (avatar_url) updateData.avatar_url = avatar_url;

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          username: users.username,
          avatar_url: users.avatar_url,
          updated_at: users.updated_at,
        });

      if (!updatedUser) return reply.notFound("User not found");

      return updatedUser;
    }
  );

  fastify.patch(
    "/api/users/change-password",
    {
      schema: ChangePasswordSchema,
      preHandler: fastify.auth,
    },
    async (
      req: FastifyRequest<{
        Body: { new: string; current: string };
      }>,
      reply: FastifyReply
    ) => {
      const userId = req.user.id;
      const { current, new: newpass } = req.body;

      const [user] = await db
        .select({ id: users.id, password_hash: users.password_hash })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return reply.notFound("User not found");
      }

      const match: boolean = await verifyPassword(current, user.password_hash);
      if (!match) {
        return reply.unauthorized("Current password is incorrect");
      }

      const newHashedPassword = await hashPassword(newpass);
      await db
        .update(users)
        .set({ password_hash: newHashedPassword })
        .where(eq(users.id, userId));

      return reply.status(200).send({ success: true });
    }
  );
}
