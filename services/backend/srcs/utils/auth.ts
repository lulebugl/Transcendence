import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "auth",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.unauthorized("Invalid or missing token");
        return;
      }
    });
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: number;
      username: string;
    };
    user: {
      id: number |  null;
      username: string | null;
      iat: number;
      exp: number;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
      auth: (req: any, reply: any) => Promise<void>;
  }
}

