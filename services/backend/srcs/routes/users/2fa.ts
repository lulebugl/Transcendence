import { eq } from "drizzle-orm";
import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifySchema,
} from "fastify";
import { users } from "../../db/schema";
import { db } from "../../db/client";
import { generateSecret, bufferToBase32 } from "../../2AF/genrate/totp_gen";
import { encryptTotpSecret, verifyPassword } from "../../utils/hash";
import base32 from "hi-base32";
import { verifyTOTP } from "../../2AF/verify/totp_verify";
import { fields } from "../schema";
import QRCode from "qrcode";

const ConfirmOtpSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["secret", "code"],
    properties: {
      secret: { type: "string" },
      code: { type: "string", pattern: "^\\d{6}$" },
    },
  },
};

interface ConfirmOtpBody {
  secret: string;
  code: string;
}

const DisableOtpSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["password"],
    properties: {
      password: { ...fields.password },
    },
  },
};

export default async function twoFactorRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/users/2fa/setup",
    { preHandler: fastify.auth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userId = req.user.id;
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          totp_secret_key: users.totp_secret_key,
        })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) return reply.notFound("User not found");
      if (user.totp_secret_key) return reply.conflict("2FA already enabled");

      const secretBuffer = generateSecret();
      const secretBase32 = bufferToBase32(secretBuffer);
      const otpauth = `otpauth://totp/${encodeURIComponent(
        user.username
      )}?secret=${secretBase32}&issuer=Transcendence`;

      const qrImage = await QRCode.toDataURL(otpauth, {
        width: 200,
        margin: 2,
      });

      return {
        secret: secretBase32,
        otpauth_url: otpauth,
        qr_image: qrImage,
      };
    }
  );

  fastify.post<{ Body: ConfirmOtpBody }>(
    "/api/users/2fa/confirm",
    { preHandler: fastify.auth, schema: ConfirmOtpSchema },
    async (
      req: FastifyRequest<{ Body: ConfirmOtpBody }>,
      reply: FastifyReply
    ) => {
      const userId = req.user.id;
      const { secret, code } = req.body;

      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          totp_secret_key: users.totp_secret_key,
        })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) return reply.notFound("User not found");
      if (user.totp_secret_key) return reply.conflict("2FA already enabled");

      const secretBytes = Buffer.from(base32.decode.asBytes(secret));
      const codeNumber = parseInt(code, 10);

      if (!verifyTOTP(secretBytes, codeNumber)) {
        return reply.unauthorized("Invalid verification code");
      }

      const encryptedKey = Buffer.from(process.env.MASTER_KEY_TOTP!, "base64");
      const encryptedSecret = encryptTotpSecret(secret, encryptedKey);

      await db
        .update(users)
        .set({ totp_secret_key: encryptedSecret })
        .where(eq(users.id, userId));

      return { success: true, message: "2FA enabled successfully" };
    }
  );

  fastify.post<{ Body: { password: string } }>(
    "/api/users/2fa/disable",
    {
      preHandler: fastify.auth,
      schema: DisableOtpSchema,
    },
    async (
      req: FastifyRequest<{ Body: { password: string } }>,
      reply: FastifyReply
    ) => {
      const userId = req.user.id;
      const { password } = req.body;

      const [user] = await db
        .select({
          password_hash: users.password_hash,
          totp_secret_key: users.totp_secret_key,
        })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) return reply.notFound("User not found");
      if (!user.totp_secret_key) return reply.conflict("2FA not enabled");

      const passwordMatch = await verifyPassword(password, user.password_hash);
      if (!passwordMatch) return reply.unauthorized("Invalid password");

      await db
        .update(users)
        .set({ totp_secret_key: null })
        .where(eq(users.id, userId));

      return { success: true, message: "2FA disabled successfully" };
    }
  );
}
