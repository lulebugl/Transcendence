import { FastifyInstance } from "fastify";

export const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname,res,reqId,responseTime",
        colorize: true,
        //   singleLine: true,
      },
    },
	serializers: {
		err: (err: any) => {
		  if (err.statusCode === 401 || err.status === 401) {
			return undefined;
		  }
		  return {
			type: err.type || err.name,
			message: err.message,
			stack: err.stack,
			...err,
		  };
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

    if (statusCode >= 500) {
		request.log.error(logData, `error: ${statusCode}`);
	} else if (statusCode >= 400) {
		request.log.warn(logData, `warn: ${statusCode}`);
    }
  });
}
