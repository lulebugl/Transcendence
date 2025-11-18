import { db } from "../db/client";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "../utils/hash";
import { verifyPassword } from "../utils/hash"
import { randomBytes } from "crypto";

//types
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Define request types
interface UserBody {
	username: string;
	email: string;
	avatarUrl?: string;
	password: string;
}

interface UserQuery {
	offset?: number;
	limit?: number;
}

interface loginBody {
	email: string;
	password: string;
}

export default async function userRoutes(fastify: FastifyInstance) {
	
	// GET - Retrieve users by pages with offset and limit
	fastify.get("/api/users", async (req: FastifyRequest<{ Querystring: UserQuery }>) => {
		const { offset = 0, limit = 10 } = req.query;
		return await db.select().from(users).limit(limit).offset(offset);
	});

	//POST - Create user
	fastify.post("/api/users/register", 
		{
			schema: {
				body: {
					type: "object",
					required: ["username", "email"],
					properties: {
						username: { type: "string" },
						email: { type: "string", format: "email" },
						avatarUrl: { type: "string" },
						password: { type: "string" },
					},
				},
			},
		},
		async (req: FastifyRequest<{ Body: UserBody }>) => {
			const { username, email, avatarUrl, password } = req.body;
			
			// Minimal checks
			if (!username.trim() || !email.trim() || !password.trim()) {
				return fastify.httpErrors.badRequest("Fields cannot be empty.");
			}
			if (password.length < 8) {
				return fastify.httpErrors.badRequest("Password must be at least 8 characters.");
			}
			
			const normalizedEmail = email.trim().toLowerCase();
			
			// Test for uniqueness of email and username
			const existing = await db.select().from(users).where(
				or(eq(users.email, normalizedEmail), eq(users.username, username))
			);
			
			if (existing.length > 0) {
				return fastify.httpErrors.conflict("Email or username already in use.");
			}
			
			const password_hash = await hashPassword(password);

			try {
				await db.insert(users).values({ 
					username: username,
					email: normalizedEmail, 
					avatar_url: avatarUrl,
					password_hash: password_hash,
				});
				return { success: true };
			} catch (err) {
				fastify.log.error(err);
				return fastify.httpErrors.badRequest("Failed to create user.");
			}
		}
	);

	// POST - Login
	fastify.post("/api/users/login",
		{
			config: { rateLimit: { max: 5, timeWindow: "1 minute"} },
			schema: {
				body: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: { type: "string", format: "email" },
						password: { type: "string" },
					},
				},
			},
		},
		async (req: FastifyRequest<{ Body:loginBody }>, reply: FastifyReply) => {
			const { email, password } = req.body;
			const normalizedEmail: string = email.trim().toLowerCase();

			const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
			if (!user) return reply.unauthorized("Invalid credentials");

			const match: boolean = await verifyPassword(password, user.password_hash);
			if (!match) return reply.unauthorized("Invalid credentials");

			const accessToken: string = fastify.jwt.sign(
				{ id: user.id, username: user.username, email: user.email }, 
				{ expiresIn: "15m" }
			);

			const refreshToken: string = randomBytes(64).toString("hex");

			await db.update(users).set({ refresh_token: refreshToken }).where(eq(users.id, user.id));

			reply.setCookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/api/users/refresh",
				maxAge: 60 * 60 * 24 * 30,
			});

			return { token: accessToken };
		}
	);

	// POST - refresh JWT token
	fastify.post("/api/users/refresh", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const refreshToken = req.cookies?.refreshToken;
			if (!refreshToken) return reply.badRequest("Missing refresh token");
			
			const [user] = await db.select().from(users).where(eq(users.refresh_token, refreshToken));
			if (!user) return reply.unauthorized("Invalid refresh token");
	
			const newAccesstoken = fastify.jwt.sign(
				{ id: user.id, username: user.username, email: user.email }, 
				{ expiresIn: "15m" }
			);
	
			const newRefreshToken = randomBytes(64).toString("hex");
			await db.update(users).set({ refresh_token: newRefreshToken }).where(eq(users.id, user.id));
			
			reply.setCookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/api/users/refresh",
				maxAge: 60 * 60 * 24 * 30,
			});
	
			return { token: newAccesstoken };
		} catch (err) {
			return reply.unauthorized("Invalid or expired refresh token");
		}
	});

	// GET - Retrieve current user
	fastify.get(
		"/api/users/me",
		{ preHandler: fastify.auth },
		async (req: FastifyRequest) => {
			return { user: req.user };
		}
	);
}