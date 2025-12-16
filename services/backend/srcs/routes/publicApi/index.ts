import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import publicApiGlobal from "./global";
import publicApiMatches from "./matches";

export default async function publicApi(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Transcendence - 3D Pong - Public API",
        description: "Public API for Transcendence - 3D Pong Game",
        version: "1.0.0",
      },
      tags: [
        { name: "global", description: "Global endpoints" },
        { name: "matches", description: "Match data endpoints" },
      ],
      components: {
        securitySchemes: {
          apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key",
          },
        },
      },
      security: [{ apiKeyAuth: [] }], // appliqué globalement
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/api/public/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      customSiteTitle: "Transcendence - 3D Pong - Public API",
    },
    theme: {
      js: [
        {
          filename: "set-title.js",
          content: 'document.title = "Transcendence - 3D Pong - Public API";',
        },
      ],
    },
  });

  await fastify.register(publicApiGlobal);
  await fastify.register(publicApiMatches);
}
