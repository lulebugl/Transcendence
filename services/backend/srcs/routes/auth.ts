import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client";
import { User, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateSecret, bufferToBase32 } from "../2AF/genrate/totp_gen";
import { encryptTotpSecret } from "../utils/hash";
import { verifyTOTP } from "../2AF/verify/totp_verify";
import base32 from "hi-base32";
import { randomBytes } from "crypto";
import { decryptTotpSecret } from "../utils/hash";
import { fields } from "./schema";
import { initPlayerStats } from "./players";
import { isEmail } from "../utils/auth";

interface UserBody {
  username: string;
  avatarUrl?: string;
  password: string;
  totp_enabled?: boolean;
  email: string;
}

interface loginBody {
  identifier: string,
  password: string;
  totp: string;
}

const MASTER_KEY = Buffer.from(process.env.MASTER_KEY_TOTP!, "base64");

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/users/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password", "email"],
          properties: {
            username: { ...fields.username },
            password: { ...fields.password },
            avatarUrl: { ...fields.url },
			email: { ...fields.email },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) => {
      const { username, avatarUrl, password, totp_enabled, email } = req.body;
      const DEFAULT_AVATAR_BASE_URL =
        "https://api.dicebear.com/7.x/avataaars/svg";

      if (!username.trim() || !password.trim() || !email.trim()) {
        return fastify.httpErrors.badRequest("Fields cannot be empty.");
      }
      if (password.length < 8) {
        return fastify.httpErrors.badRequest(
          "Password must be at least 8 characters."
        );
      }

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (existing.length > 0) {
        return fastify.httpErrors.conflict("Username already in use.");
      }

      const password_hash = await hashPassword(password);
      const secretBuffer: Buffer = generateSecret();
      const secretBase32: string = bufferToBase32(secretBuffer);
      const secret_hash = totp_enabled
        ? encryptTotpSecret(secretBase32, MASTER_KEY)
        : null;
      const otpauth = `otpauth://totp/${encodeURIComponent(
        username
      )}?secret=${secretBase32}&issuer=MyApp`;

      try {
        await db.insert(users).values({
          username: username,
          avatar_url: avatarUrl
            ? avatarUrl
            : `${DEFAULT_AVATAR_BASE_URL}?seed=NeoPaddle`,
          password_hash: password_hash,
          totp_secret_key: secret_hash,
		  email: email,
        });

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.username, username));

      	if (!user) return reply.unauthorized("Invalid credentials");

		const accessToken: string = fastify.jwt.sign(
			{ id: user.id, username: user.username },
			{ expiresIn: "15m" }
		);

		const refreshToken: string = randomBytes(64).toString("hex");

		await db
			.update(users)
			.set({ refresh_token: refreshToken })
			.where(eq(users.id, user.id));

		reply.setCookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/api/users/refresh",
			maxAge: 60 * 60 * 24 * 30,
		});
		
		initPlayerStats(user.id);
		
        return {
          success: true,
          secret: secretBase32,
          otpauth_url: otpauth,
		  token: accessToken,
        };
      } catch (err) {
        fastify.log.error(err);
        return fastify.httpErrors.badRequest("Failed to create user.");
      }
    }
  );

  // POST - Login
  fastify.post(
    "/api/users/login",
    {
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
      schema: {
        body: {
          type: "object",
          required: ["password", "identifier"],
          properties: {
            identifier: { 
				type: "string",
				minLength: 3,
				maxLength: 255,
			},
            password: { ...fields.password },
            totp: { type: "string" },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Body: loginBody }>, reply: FastifyReply) => {
      const { identifier, password, totp } = req.body;

      let totpNumber: number = 1;
      const [user] = await db
        .select()
        .from(users)
        .where(
			isEmail(identifier)
			? eq(users.email, identifier) 
			: eq(users.username, identifier)
		);

      if (!user) return reply.unauthorized("Invalid credentials");

      const match: boolean = await verifyPassword(password, user.password_hash);
      if (!match) {
        return reply.unauthorized("Invalid credentials");
      }

      if (user.totp_secret_key) {
        if (!totp) {
          return reply.send({ require2fa: true });
        }

        fastify.log.info(`TOTP submitted for user '${identifier}': ${totp}`);

        const parsedTotp = totp.replace(/\s+/g, "");
        if (!/^\d{6}$/.test(parsedTotp)) {
          return reply.unauthorized("Invalid TOTP format");
        }
        totpNumber = parseInt(parsedTotp, 10);

        const decrypted = decryptTotpSecret(user.totp_secret_key, MASTER_KEY);
        const secret = Buffer.from(base32.decode.asBytes(decrypted));

        if (!verifyTOTP(secret, totpNumber)) {
          return reply.unauthorized("Invalid code");
        }
      }

      const accessToken: string = fastify.jwt.sign(
        { id: user.id, username: user.username },
        { expiresIn: "15m" }
      );

      const refreshToken: string = randomBytes(64).toString("hex");

      await db
        .update(users)
        .set({ refresh_token: refreshToken })
        .where(eq(users.id, user.id));

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

  // POST - Refresh jwt token
  fastify.post(
    "/api/users/refresh",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return reply.badRequest("Missing refresh token");

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.refresh_token, refreshToken));
        if (!user) return reply.unauthorized("Invalid refresh token");

        const newAccesstoken = fastify.jwt.sign(
          { id: user.id, username: user.username },
          { expiresIn: "15m" }
        );

        const newRefreshToken = randomBytes(64).toString("hex");
        await db
          .update(users)
          .set({ refresh_token: newRefreshToken })
          .where(eq(users.id, user.id));

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
    }
  );

  fastify.post(
    "/api/users/refresh/logout",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await db
          .update(users)
          .set({ refresh_token: null })
          .where(eq(users.refresh_token, refreshToken));
      }

      reply.clearCookie("refreshToken", { path: "/api/users/refresh" });
      return reply.status(200).send({ message: "Logged out successfully" });
    }
  );
}


