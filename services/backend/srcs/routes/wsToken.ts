import { FastifyInstance } from "fastify";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function wsToken(fastify: FastifyInstance) {
    fastify.get('/api/wsToken', {
        preHandler: fastify.auth
    }, async (request, reply) => {
        const { id, username } = request.user;
        const token = fastify.jwt.sign({ id, username }, { expiresIn: "30s" });
        reply.send({ token });
    });
}

export const GenerateToken = (fastify: FastifyInstance, id: number, username: string) => {
    return fastify.jwt.sign({ id, username }, { expiresIn: "15s" });
};
