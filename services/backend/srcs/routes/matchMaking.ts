import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { GenerateToken } from "./wsToken";

interface Player {
    id: string;
    username: string;
}

const queue = new Map<string, Player>();

export default function matchMaking(fastify: FastifyInstance) {
    fastify.post('/api/matchmaking/join', {
        preHandler: fastify.auth
    }, async (request, reply) => {
        const { id, username } = request.user;
        const playerId = id.toString();
        queue.set(playerId, { id: playerId, username });
        reply.send({ status: "joined", position: queue.size });
    });
    fastify.post('/api/matchmaking/leave', {
        preHandler: fastify.auth
    }, async (request, reply) => {
        const playerId = request.user.id.toString();
        queue.delete(playerId);
        reply.send({ status: "left" });
    });

    const playerMatches = new Map<string, string>();
    let matchCreationInProgress = false;

    fastify.get('/api/matchmaking/status', {
        preHandler: fastify.auth
    }, async (request, reply) => {
        const playerId = request.user.id.toString();

        if (playerMatches.has(playerId)) {
            reply.send({
                status: "matched",
                matchId: playerMatches.get(playerId),
                wsToken: GenerateToken(fastify, playerId, request.user.username),
                id: playerId,
            });
            return;
        }

        if (matchCreationInProgress) {
            return reply.send({
                status: "waiting",
                queueSize: queue.size
            });
        }

        if (queue.size >= 2) {
            if (!queue.has(playerId)) {
                reply.send({ status: "error", message: "Player not in queue" });
                return;
            }

            matchCreationInProgress = true;

            try {
                const players = Array.from(queue.values());
                const p1 = players[0];
                const p2 = players[1];
                const matchId = crypto.randomUUID();

                queue.delete(p1.id);
                queue.delete(p2.id);

                playerMatches.set(p1.id, matchId);
                playerMatches.set(p2.id, matchId);

                if (p1.id === playerId || p2.id === playerId) {
                    reply.send({
                        status: "matched",
                        matchId: matchId,
                        wsToken: GenerateToken(fastify, p1.id, p1.username),
                        id: playerId,

                    });
                } else {
                    reply.send({
                        status: "waiting",
                        queueSize: queue.size
                    });
                }
            } finally {
                matchCreationInProgress = false;
            }
        } else {
            reply.send({
                status: "waiting",
                queueSize: queue.size
            });
        }
    });
}
