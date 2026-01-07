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
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/api/public/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    theme: {
      js: [
        {
          filename: "set-title.js",
          content: 'document.title = "Transcendence - 3D Pong - Public API";',
        },
        {
          filename: "add-footer-link.js",
          content: `window.addEventListener("load", () => {
  const footer = document.createElement("div");
  footer.className = "swagger-footer-link";
  footer.innerHTML = '<a href="/" class="footer-link">← Back to site</a>';
  document.body.appendChild(footer);
});`,
        },
      ],
      css: [
        {
          filename: "hide-topbar.css",
          content: ".swagger-ui .topbar { display: none; }",
        },
        {
          filename: "footer-link.css",
          content:
            ".swagger-footer-link { margin: 32px auto; text-align: center; } .swagger-footer-link .footer-link { color: #61affe; text-decoration: none; font-weight: 600; } .swagger-footer-link .footer-link:hover { text-decoration: underline; }",
        },
      ],
    },
  });

  await fastify.register(publicApiGlobal);
  await fastify.register(publicApiMatches);
}
