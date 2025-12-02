import userRoutes from "./users";
import healthRoutes from "./health";
import pingRoutes from "./ping";
import authRoutes from "./auth";
import matchMaking from "./matchMaking";
//types
import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance) {
	fastify.register(userRoutes);
	fastify.register(healthRoutes);
	fastify.register(pingRoutes);
	fastify.register(authRoutes);
	fastify.register(matchMaking);
}
