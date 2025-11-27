import { db } from "../db/client";
import { users } from "../db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import { hashPassword } from "../utils/hash";
import 'dotenv/config';

//types
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
type User = InferSelectModel<typeof users>;

export function serializeUser(user: User) {
	const { id, username, avatar_url } = user;
	return { id, username, avatar_url };
}

// Define request types
interface UserQuery {
  offset?: number;
  limit?: number;
}

interface SingleUserQuery {
	id: number;
}

interface UserUpdateBody {
	username?: string;
	avatarUrl?: string;
	password?: string;
}

export default async function userRoutes(fastify: FastifyInstance) {
	// GET - Retrieve users by pages with offset and limit
	fastify.get(
		"/api/users",
		async (req: FastifyRequest<{ Querystring: UserQuery }>) => {
			const { offset = 0, limit = 10 } = req.query;
			const [user] = await db.select().from(users).limit(limit).offset(offset);
		}
	);

	// GET - Retrieve current user
	fastify.get(
		"/api/users/me",
		{ preHandler: fastify.auth },
		async (req: FastifyRequest, reply: FastifyReply) => {
			const id  = req.user.id;

			const [user] = await db.select().from(users).where(eq(users.id, id));
			if (!user) return reply.unauthorized("User not found");

			return serializeUser(user);
		}
	);

	// PUT - Update current user
	fastify.put("/api/users/me", 
		{ 
			preHandler: fastify.auth, 
			schema: {
				body: {
					type: "object",
					properties: {
						username: { type: "string" },
						avatarUrl: { type: "string" },
						password: { type: "string" },
					},
				},
			},
		}, 
		async (req: FastifyRequest<{ Body: UserUpdateBody }>, reply: FastifyReply) => {
			const { password, username, avatarUrl } = req.body;
			const updateData: Partial<typeof users.$inferInsert> = {};

			if (username !== undefined) {
				if (!username.trim())
        			return fastify.httpErrors.badRequest("Username cannot be empty.");

				const existing = await db.select().from(users).where(eq(users.username, username));
			
				if (existing.length > 0)
					return fastify.httpErrors.conflict("Username already in use.");

				updateData.username = username;
			}

			if (password !== undefined) {
				if (!password.trim())
        			return fastify.httpErrors.badRequest("Password cannot be empty.");

				if (password.length < 8)
					return fastify.httpErrors.badRequest("Password must be at least 8 characters.");
			
				updateData.password_hash = await hashPassword(password);
			}

			if (avatarUrl !== undefined) {
				if (!avatarUrl.trim())
					return fastify.httpErrors.badRequest("Avatar url cannot be empty.");
      			updateData.avatar_url = avatarUrl;
    		}

			if (Object.keys(updateData).length === 0) {
      			return fastify.httpErrors.badRequest("No fields to update.");
    		}

			try {
				await db.update(users).set(updateData).where(eq(users.id, req.user.id));
				return { success: true };
			} catch (err) {
				fastify.log.error(err);
				return fastify.httpErrors.badRequest("Failed to update user.");
			}
		}
	);

	// GET - Retrieve single user
	fastify.get("/api/users/:id", async (req: FastifyRequest<{ Querystring: SingleUserQuery }>, reply: FastifyReply) => {
		const { id } = req.query;

		const [user] = await db.select().from(users).where(eq(users.id, id));
		if (!user) return reply.unauthorized("User not found");

		return serializeUser(user);
	});

	// DELETE - Delete current user
	fastify.delete("/api/users/me", { preHandler: fastify.auth }, 
		async (req: FastifyRequest, reply: FastifyReply) => {
			await db.delete(users).where(eq(users.id, req.user.id));
			reply.code(204).send();
		}
	);
}
