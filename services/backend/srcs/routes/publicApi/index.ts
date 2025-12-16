import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import publicApiGlobal from "./global";
import publicApiMatches from "./matches";

export default async function publicApi(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Public API",
        description: "Public endpoints (API key required)",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/api/public/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });

  await fastify.register(publicApiGlobal);
  await fastify.register(publicApiMatches);
}
