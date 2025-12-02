import { FastifyInstance } from "fastify";
import crypto from "crypto";

interface Player {
    id: string;
    username: string;
}

const queue = new Map<string, Player>();

export default function matchMaking(fastify: FastifyInstance) {
    fastify.post('/api/matchmaking/join', {
        schema: {
            body: {
                type: "object",
                required: ["username", "playerId"],
                properties: {
                    username: { type: "string" },
                    playerId: { type: "string" }
                }
            }
        }
    }, async (request, reply) => {
        const { username, playerId } = request.body as { username: string, playerId: string };
        queue.set(playerId, { id: playerId, username });
        reply.send({ status: "joined", position: queue.size });
    });
    fastify.post('/api/matchmaking/leave', {
        schema: {
            body: {
                type: "object",
                required: ["playerId"],
                properties: {
                    playerId: { type: "string" }
                }
            }
        }
    }, async (request, reply) => {
        const { playerId } = request.body as { playerId: string };
        queue.delete(playerId);
        reply.send({ status: "left" });
    });

    // STATUS
    const playerMatches = new Map<string, string>(); // playerId -> matchId

    fastify.get('/api/matchmaking/status', {
        schema: {
            querystring: {
                type: "object",
                required: ["playerId"],
                properties: {
                    playerId: { type: "string" }
                }
            }
        }
    }, async (request, reply) => {
        const { playerId } = request.query as { playerId: string };

        // Check if player already has a match
        if (playerMatches.has(playerId)) {
            reply.send({
                status: "matched",
                matchId: playerMatches.get(playerId)
            });
            return;
        }

        // Try to match if enough players
        if (queue.size >= 2) {
            // Check if current player is in queue
            if (!queue.has(playerId)) {
                reply.send({ status: "error", message: "Player not in queue" });
                return;
            }

            // Get players
            const players = Array.from(queue.values());
            const p1 = players[0];
            const p2 = players[1];

            // Only create match if the requesting player is one of the first two
            // Actually, just create the match regardless of who asks, as long as we have 2.
            // But we need to make sure we don't create multiple matches for same people.

            const matchId = crypto.randomUUID();

            queue.delete(p1.id);
            queue.delete(p2.id);

            playerMatches.set(p1.id, matchId);
            playerMatches.set(p2.id, matchId);

            // Clean up match assignment after some time? 
            // For now, let's just keep it simple.

            if (p1.id === playerId || p2.id === playerId) {
                reply.send({
                    status: "matched",
                    matchId: matchId
                });
            } else {
                reply.send({
                    status: "waiting",
                    queueSize: queue.size
                });
            }
        } else {
            reply.send({
                status: "waiting",
                queueSize: queue.size
            });
        }
    });
}