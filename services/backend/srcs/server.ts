import 'dotenv/config';
import Fastify from 'fastify';
import routes from "./routes";
// @ts-ignore: No type definitions for this JS module
import { startWebSocketServer } from './miniBackendPong.js';

const app = Fastify({ logger: true });

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