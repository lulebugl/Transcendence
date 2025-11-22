import { FastifyInstance } from "fastify";

export const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname,req,res,err,reqId,responseTime",
        colorize: true,
        //   singleLine: true,
      },
    },
  },
  production: true,
} as const;

export function prettifyLogger(app: FastifyInstance) {
  app.addHook("onResponse", async (request, reply) => {
    const statusCode = reply.statusCode;
    const logData = {
      method: request.method,
      url: request.url,
    };

    if (statusCode >= 400) {
      request.log.warn(logData, `warn: ${statusCode}`);
    } else if (statusCode >= 500) {
      request.log.error(logData, `error: ${statusCode}`);
    }
  });
}
