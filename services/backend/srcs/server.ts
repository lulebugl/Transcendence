import 'dotenv/config';
import Fastify from 'fastify';
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import authPlugin from './utils/auth';
import routes from "./routes";
import fp from "fastify-plugin";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import type { FastifyCookieOptions } from '@fastify/cookie';
import { startWebSocketServer } from './pong/miniBackendPong';
import rateLimit from "@fastify/rate-limit";
import { envToLogger, prettifyLogger } from './utils/logger-config';

const app = Fastify({ logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] });

// Log 4xx and 5xx responses as WARN and ERROR respectively
prettifyLogger(app);

app.register(fp(authPlugin));
app.register(sensible);
app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-secret",
});
app.register(cors, {
	// this is the frontend url for dev not prod so maybe check later
	// also maybe make the url dynamic from the env
	origin: ["https://localhost:5173", "https://localhost:8443"],
	credentials: true,
	allowedHeaders: ["Authorization", "Content-Type"],
})
app.register(cookie, {
	secret: process.env.COOKIE_SIGN,
	hook: "onRequest",
} as FastifyCookieOptions)

if (process.env.NODE_ENV !== "development") {
	// maybe 20 is too little, not sure
	app.register(rateLimit, {
		max: 20,
		timeWindow: "1 minute"
	})
}

app.register(routes);

// setup server
async function main() {
  const port = Number(process.env.PORT) || 3000;
  const host = '0.0.0.0';
  
  startWebSocketServer(9000);
  await app.listen({ port, host }), function (err: Number, address: string) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
  };
}

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
});

main();
