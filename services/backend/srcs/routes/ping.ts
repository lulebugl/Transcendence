
//types
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function pingRoutes(fastify: FastifyInstance) {
	fastify.get('/api/ping', async function(request: FastifyRequest, reply: FastifyReply) {
	  return {
		pong: 'pong',
		message: '🏓 3D Pong API is running!' 
	  }
	})
}
