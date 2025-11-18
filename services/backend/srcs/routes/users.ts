import { db } from "../db/client";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "../utils/hash";
import { verifyPassword } from "../utils/hash"
import { encryptTotpSecret } from "../utils/hash"
import { decryptTotpSecret } from "../utils/hash"
import { generateSecret, bufferToBase32 } from "../2AF/genrate/totp_gen"
import { verifyTOTP } from "../2AF/verify/totp_verify"
import base32 from "hi-base32";
import 'dotenv/config'
//types
import { FastifyInstance, FastifyRequest } from "fastify";
import { Buffer } from 'buffer';
import dotenv from "dotenv";
dotenv.config();

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

const masterKey = Buffer.from(process.env.MASTER_KEY_TOTP!, "base64");
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
          required: ["username", "email",],
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
      const secretBuffer: Buffer = generateSecret();
      const secretBase32: string = bufferToBase32(secretBuffer);
      const secret_hash = encryptTotpSecret(secretBase32, masterKey);
      const otpauth = `otpauth://totp/${encodeURIComponent(
        username
      )}?secret=${secretBase32}&issuer=MyApp`;

      try {
        await db.insert(users).values({
          username: username,
          email: normalizedEmail,
          avatar_url: avatarUrl,
          password_hash: password_hash,
          secret_key: secret_hash,
        });
        return {
          success: true,
          secret: secretBase32,
          otpauth_url: otpauth,
        };
      } catch (err) {
        fastify.log.error(err);
        return fastify.httpErrors.badRequest("Failed to create user.");
      }
    }
  );

  // POST - Login
  fastify.post("/api/users/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password", "totp"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
            totp: { type: "number" },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Body: loginBody }>) => {
      const { email, password, totp } = req.body;
      const normalizedEmail: string = email.trim().toLowerCase();

      const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));

      if (!user) {
        return fastify.httpErrors.unauthorized("Invalid credentials");
      }

      const match: boolean = await verifyPassword(password, user.password_hash);

      if (!match || !verifyTOTP(Buffer.from(base32.decode.asBytes(decryptTotpSecret(user.secret_key, masterKey))), totp)) {
        return fastify.httpErrors.unauthorized("Invalid credentials");
      }

      const token: string = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      return { token };
    }
  );

  // GET - Retrieve current user
  fastify.get(
    "/api/users/me",
    {
      preHandler: [fastify.auth],
    },
    async (req: FastifyRequest) => {
      return { user: req.user };
    }
  );
}
