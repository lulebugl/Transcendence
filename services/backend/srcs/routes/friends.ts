import { db } from "../db/client";
import { friendships, users } from "../db/schema";
import { eq, and, or, InferSelectModel } from "drizzle-orm";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";

// Help to return user without sensible datas
type User = InferSelectModel<typeof users>;
export function serializeUser(user: User) {
  const { id, username, avatar_url, last_call } = user;
  return { id, username, avatar_url, last_call };
}

interface RequestBody {
  id: number;
}

const requestSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
};

const paramSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
};

export default async function friendsRoute(fastify: FastifyInstance) {
  // create friendship request
  fastify.post(
    "/api/friends/request",
    {
      schema: requestSchema,
      preHandler: fastify.auth,
    },
    async (req: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
      const { id } = req.body;

      const recieverUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!recieverUser[0])
        return reply.badRequest("request user doesn't exist");
      if (recieverUser[0].id === req.user.id)
        return reply.badRequest("you cannot friend yourself");

      const exist = await db
        .select()
        .from(friendships)
        .where(
          and(
            or(
              and(
                eq(friendships.requesterId, req.user.id),
                eq(friendships.receiverId, id)
              ),
              and(
                eq(friendships.requesterId, id),
                eq(friendships.receiverId, req.user.id)
              )
            )
          )
        );

      if (exist.length > 0) return reply.badRequest("friendship already exist");

      try {
        await db.insert(friendships).values({
          receiverId: recieverUser[0].id,
          requesterId: req.user.id,
          status: "pending",
        });

        return { success: true };
      } catch (err) {
        fastify.log.error(err);
        return fastify.httpErrors.badRequest("Failed to create friendship.");
      }
    }
  );

  // accept friendship
  fastify.post(
    "/api/friends/accept",
    {
      schema: requestSchema,
      preHandler: fastify.auth,
    },
    async (req: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
      const { id } = req.body;

      const [request] = await db
        .select()
        .from(friendships)
        .where(
          and(
            eq(friendships.receiverId, req.user.id),
            eq(friendships.requesterId, id),
            eq(friendships.status, "pending")
          )
        );

      if (!request)
        return reply.badRequest(
          "no friendship request from the specified user"
        );

      await db
        .update(friendships)
        .set({ status: "accepted" })
        .where(
          and(
            eq(friendships.receiverId, req.user.id),
            eq(friendships.requesterId, id),
            eq(friendships.status, "pending")
          )
        );
      return { success: true };
    }
  );

  // delete a friend or pending request
  fastify.delete(
    "/api/friends/:id",
    {
      schema: paramSchema,
      preHandler: fastify.auth,
    },
    async (
      req: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;

      const deleted = await db
        .delete(friendships)
        .where(
          or(
            and(
              eq(friendships.receiverId, id),
              eq(friendships.requesterId, req.user.id)
            ),
            and(
              eq(friendships.receiverId, req.user.id),
              eq(friendships.requesterId, id)
            )
          )
        )
        .returning();

      if (deleted.length === 0)
        return reply.internalServerError("Failed to delete friendship");

      return { success: true };
    }
  );

  fastify.get(
    "/api/friends",
    { preHandler: fastify.auth },
    async (req: FastifyRequest) => {
      return await getFriendshipsWithUserInfo(req.user.id, "accepted");
    }
  );

  // get list of pending friends
  fastify.get(
    "/api/friends/pending",
    { preHandler: fastify.auth },
    async (req: FastifyRequest) => {
      return await getFriendshipsWithUserInfo(req.user.id, "pending");
    }
  );
}

async function getFriendshipsWithUserInfo(
  userId: number,
  status: "accepted" | "pending"
) {
  // user initiated the friendship/request
  const asRequester = await db
    .select({
      requesterId: friendships.requesterId,
      receiverId: friendships.receiverId,
      status: friendships.status,
      id: users.id,
      username: users.username,
      avatar_url: users.avatar_url,
      last_call: users.last_call,
    })
    .from(friendships)
    .innerJoin(users, eq(friendships.receiverId, users.id))
    .where(
      and(eq(friendships.requesterId, userId), eq(friendships.status, status))
    );

  // user received the request
  const asReceiver = await db
    .select({
      requesterId: friendships.requesterId,
      receiverId: friendships.receiverId,
      status: friendships.status,
      id: users.id,
      username: users.username,
      avatar_url: users.avatar_url,
      last_call: users.last_call,
    })
    .from(friendships)
    .innerJoin(users, eq(friendships.requesterId, users.id))
    .where(
      and(eq(friendships.receiverId, userId), eq(friendships.status, status))
    );

  return [...asRequester, ...asReceiver];
}
