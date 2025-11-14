import { db } from "../db/client";
import { users } from "../db/schema";

//types
import { FastifyInstance, FastifyRequest } from "fastify";

// Define request types
interface UserBody {
	username: string;
	email: string;
	avatarUrl?: string; 
}

interface UserQuery {
	offset?: number;
	limit?: number;
}

export default async function userRoutes(fastify: FastifyInstance) {
	
	// GET - Retrieve users by pages with offset and limit
	fastify.get("/api/users", async (req: FastifyRequest<{ Querystring: UserQuery }>) => {
		const { offset = 0, limit = 10 } = req.query;
		return await db.select().from(users).limit(limit).offset(offset);
	});

	//POST - Create user
	fastify.post("/api/users", 
		{
			schema: {
				body: {
					type: "object",
					required: ["username", "email"],
					properties: {
						username: { type: "string" },
						email: { type: "string", format: "email" },
						avatarUrl: { type: "string" },
					},
				},
			},
		},
		async (req: FastifyRequest<{ Body: UserBody }>) => {
			const { username, email, avatarUrl} = req.body;
			try {
				await db.insert(users).values({ 
					username: username,
					email: email, 
					avatar_url: avatarUrl,
				});
				return { success: true };
			} catch (err) {
				fastify.log.error(err);
				return fastify.status(400).send({ error: "Failed to create user" });
			}
		}
	);
}