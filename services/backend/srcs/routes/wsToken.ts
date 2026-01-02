import { FastifyInstance } from "fastify";

export default function wsToken(fastify: FastifyInstance) {
    fastify.get('/api/wsToken', {
        preHandler: fastify.auth
    }, async (request, reply) => {
        const { id, username } = request.user;
        const playerId = id.toString();
        const token = fastify.jwt.sign({ playerId, username }, { expiresIn: "30s" });
        reply.send({ token });
    });
}

export const GenerateToken = (fastify: FastifyInstance, playerId: string, username: string) => {
    return fastify.jwt.sign({ playerId, username }, { expiresIn: "15s" });
};
