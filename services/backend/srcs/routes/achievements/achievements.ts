import { FastifyInstance, FastifyRequest } from "fastify";
import { getAllAchievements, getUserAchievementIds } from "./achievements-utils";

export default async function achievementsRoutes(fastify: FastifyInstance) {
  // maybe we can make this one public
  fastify.get("/api/achievements", async () => {
    return await getAllAchievements();
  });

  fastify.get(
    "/api/users/:id/achievements",
    async (req: FastifyRequest<{ Params: { id: number } }>) => {
      const userId = Number(req.params.id);
      if (isNaN(userId) || userId < 1) return fastify.httpErrors.badRequest("Invalid user ID");
      return await getUserAchievementIds(userId);
    }
  );
}
