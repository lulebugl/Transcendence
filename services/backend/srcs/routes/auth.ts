import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, decryptTotpSecret  } from "../utils/hash";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyTOTP } from "../2AF/verify/totp_verify"
import base32 from "hi-base32";
import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();
const masterKey = Buffer.from(process.env.MASTER_KEY_TOTP!, "base64");

interface UserBody {
	username: string;
	avatarUrl?: string;
	password: string;
}

interface loginBody {
	username: string;
	password: string;
	totp: number;
}

export default async function authRoutes(fastify: FastifyInstance) {

	//POST - Create user
	fastify.post("/api/auth/register", 
		{
			schema: {
				body: {
					type: "object",
					required: ["username"],
					properties: {
						username: { type: "string" },
						avatarUrl: { type: "string" },
						password: { type: "string" },
					},
				},
			},
		},
		async (req: FastifyRequest<{ Body: UserBody }>) => {
			const { username, avatarUrl, password } = req.body;
			
			// Minimal checks
			if (!username.trim() || !password.trim()) {
				return fastify.httpErrors.badRequest("Fields cannot be empty.");
			}
			if (password.length < 8) {
				return fastify.httpErrors.badRequest("Password must be at least 8 characters.");
			}
			
			// Test for uniqueness of username
			const existing = await db.select().from(users).where(eq(users.username, username));
			
			if (existing.length > 0) {
				return fastify.httpErrors.conflict("Username already in use.");
			}
			
			const password_hash = await hashPassword(password);

			try {
				await db.insert(users).values({ 
					username: username,
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
	fastify.post("/api/auth/login",
		{
			config: { rateLimit: { max: 20, timeWindow: "1 minute"} },
			schema: {
				body: {
					type: "object",
					required: ["username", "password", "totp"],
					properties: {
						username: { type: "string" },
						password: { type: "string" },
						totp: { type: "number" },
					},
				},
			},
		},
		async (req: FastifyRequest<{ Body:loginBody }>, reply: FastifyReply) => {
			const { username, password, totp } = req.body;

			const [user] = await db.select().from(users).where(eq(users.username, username));
			if (!user) return reply.unauthorized("Invalid credentials");

			//FLAG FOR DISABLE TOTP auth 
			const DisableTotp: boolean = true;
			const match: boolean = await verifyPassword(password, user.password_hash);
			if (!match || (!DisableTotp && !verifyTOTP(Buffer.from(base32.decode.asBytes(decryptTotpSecret(user.secret_key, masterKey))), totp)))
				return reply.unauthorized("Invalid credentials");

			const accessToken: string = fastify.jwt.sign(
				{ id: user.id, username: user.username }, 
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
	fastify.post("/api/auth/refresh", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const refreshToken = req.cookies?.refreshToken;
			if (!refreshToken) return reply.badRequest("Missing refresh token");
			
			const [user] = await db.select().from(users).where(eq(users.refresh_token, refreshToken));
			if (!user) return reply.unauthorized("Invalid refresh token");
	
			const newAccesstoken = fastify.jwt.sign(
				{ id: user.id, username: user.username }, 
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

	fastify.post("/api/users/refresh/logout", async (req: FastifyRequest, reply: FastifyReply) => {
		const refreshToken = req.cookies?.refreshToken;

		if (refreshToken) {
			await db.delete(users).where(eq(users.refresh_token, refreshToken));
		}

		reply.clearCookie("refreshToken", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/api/users/refresh",
			maxAge: 60 * 60 * 24 * 30,
		});

		return reply.send({ success: true });
	});
}