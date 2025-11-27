import userRoutes from "./users";
import healthRoutes from "./health";
import pingRoutes from "./ping";
import blockchainRoutes from "./blockchain";

//types
import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance) {
  fastify.register(userRoutes);
  fastify.register(healthRoutes);
  fastify.register(pingRoutes);
  fastify.register(blockchainRoutes);
}
