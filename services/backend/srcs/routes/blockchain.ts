import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  recordWinnerOnChain,
  getResultFromChain,
  getUserResultsFromChain,
} from "../utils/blockchainService";

const tournamentsRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // Enregistrer le gagnant d'un tournoi sur la blockchain
  fastify.post<{
    Params: { id: string }; // tournamentId
    Body: { winnerId: number }; // playerId gagnant
  }>(
    "/api/tournaments/:id/winner",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            winnerId: { type: "number" },
          },
          required: ["winnerId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              txHash: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const tournamentId = Number(request.params.id);
        const { winnerId } = request.body;

        const result = await recordWinnerOnChain(tournamentId, winnerId);

        return reply.send({
          success: result.success,
          txHash: result.txHash,
        });
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          success: false,
          error: "Failed to record winner on chain",
          detail: err.message,
        });
      }
    }
  );

  // Récupérer le résultat d'un tournoi par son ID
  fastify.get<{
    Params: { id: string };
  }>(
    "/api/tournaments/:id/result",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (request, reply) => {
      try {
        const tournamentId = Number(request.params.id);
        // Pour l'instant, on suppose que le resultId correspond au tournamentId
        // Dans une vraie application, il faudrait maintenir un mapping
        const result = await getResultFromChain(tournamentId);

        return reply.send(result);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch tournament result from chain",
          detail: err.message,
        });
      }
    }
  );

  // Lire un résultat sur la blockchain par resultId
  fastify.get<{
    Params: { resultId: string };
  }>(
    "/api/blockchain/results/:resultId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            resultId: { type: "string" },
          },
          required: ["resultId"],
        },
      },
    },
    async (request, reply) => {
      try {
        const resultId = Number(request.params.resultId);
        const result = await getResultFromChain(resultId);

        return reply.send(result);
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch result from chain",
          detail: err.message,
        });
      }
    }
  );

  // Récupérer les tournois gagnés par un utilisateur
  fastify.get<{
    Params: { userId: string };
  }>(
    "/api/users/:userId/results",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = Number(request.params.userId);
        const tournaments = await getUserResultsFromChain(userId);

        return reply.send({ userId, tournaments });
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch user results from chain",
          detail: err.message,
        });
      }
    }
  );
};

export default tournamentsRoutes;
