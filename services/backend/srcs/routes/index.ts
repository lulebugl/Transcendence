import userRoutes from "./users";
import healthRoutes from "./health";
import pingRoutes from "./ping";
import authRoutes from "./auth";
import matchMakingRoutes from "./matchMaking";
import playersRoutes from "./players";
import twoFactorRoutes from "./users/2fa";

//types
import { FastifyInstance } from "fastify";
import friendsRoute from "./users/friends";

export default async function routes(fastify: FastifyInstance) {
	fastify.register(userRoutes);
	fastify.register(healthRoutes);
	fastify.register(pingRoutes);
	fastify.register(authRoutes);
	fastify.register(friendsRoute);
	fastify.register(matchMakingRoutes);
	fastify.register(playersRoutes);
	fastify.register(twoFactorRoutes);
}
