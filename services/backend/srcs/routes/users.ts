import { db } from "../db/client";
import { users } from "../db/schema";
import { eq, and, ne, InferSelectModel } from "drizzle-orm";
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
import { date } from "drizzle-orm/mysql-core";
import fs from "fs";
import path from "path";

dotenv.config();

// Help to return user without sensible datas
type User = InferSelectModel<typeof users>;
export function serializeUser(user: User) {
	const { id, username, avatar_url, last_call } = user;
	return { id, username, avatar_url, last_call };
}

interface UserBody {
  offset?: number;
  limit?: number;
}

interface SingleUserBody {
	id: number;
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
    async (req: FastifyRequest<{ Body: UserBody }>) => {
      const { offset = 0, limit = 10 } = req.body;
      return await db.select().from(users).limit(limit).offset(offset);
    }
  );

  fastify.patch(
    "/api/users/update",
    {
      schema: UpdateProfileSchema,
      preHandler: fastify.auth,
    },
    async (req: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply) => {
      const userId = req.user.id;
      const { username, avatar_url } = req.body;

      // can this happen? i don't think so based on schema
	  // Yes, as none of them are required so it allow the user to update them independently
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

  fastify.delete(
    "/api/users/delete",
    { preHandler: fastify.auth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const deleted = await db
        .delete(users)
        .where(eq(users.id, req.user.id))
        .returning();

      if (deleted.length === 0) {
        return reply.internalServerError("Failed to delete user");
      }

      reply.code(204).send();
    }
  );

  	// GET - Retrieve single user
	fastify.get(
		"/api/users/:id", 
		async (req: FastifyRequest<{ Body: SingleUserBody }>, reply: FastifyReply) => {
			const { id } = req.body;

			const [user] = await db.select().from(users).where(eq(users.id, id));
			if (!user) return reply.unauthorized("User not found");

			return serializeUser(user);
		}
	);

	fastify.patch(
		"/api/users/lastCall",
		async (req : FastifyRequest, reply : FastifyReply) => {
			await db.update(users).set({ last_call: new Date() }).where(eq(users.id, req.user.id));
			return reply.status(200).send({ success: true });
		}
	);

	fastify.post( "/api/users/avatar",
		{ preHandler: fastify.auth },
		async (req: FastifyRequest, rep: FastifyReply) => {
			const data = await req.file();

			if (!data) return rep.badRequest("No file uploaded");

			if (!["image/png", "image/jpeg", "image/jpg"].includes(data.mimetype))
      			return rep.status(400).send({ error: "Invalid file type" });

			const [user] = await db
				.select({ avatar_url: users.avatar_url })
				.from(users)
				.where(eq(users.id, req.user.id));
			
			if (user?.avatar_url) {
				const oldAvatarPath = path.join(
					__dirname,
					"..",
					"public",
					user.avatar_url.replace("/public/", "")
				);

				if (fs.existsSync(oldAvatarPath)) {
					try {
						fs.unlinkSync(oldAvatarPath);
					} catch (err) {
						req.log.warn(`Failed to delete old avatar: ${err}`);
					}
				}
			}

			const filename = `${req.user.id}_${Date.now()}_${data.filename}`;
			const savePath = path.join(__dirname, "..", "public", "avatars", filename);

			fs.mkdirSync(path.dirname(savePath), { recursive: true });

			const writeStream = fs.createWriteStream(savePath);		
			await data.file.pipe(writeStream);

			await new Promise<void>((resolve, reject) => {
				writeStream.on("finish", () => resolve());
				writeStream.on("error", reject);
			});

			await db
				.update(users)
				.set({ avatar_url: `/public/avatars/${filename}` })
				.where(eq(users.id, req.user.id));

			return { success: true, avatarUrl: `/public/avatars/${filename}` };
		}
	);
}
