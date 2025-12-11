import "@fastify/multipart";

declare module "fastify" {
  interface FastifyRequest {
    file: () => Promise<import("@fastify/multipart").MultipartFile>;
    files: () => AsyncIterableIterator<import("@fastify/multipart").MultipartFile>;
  }
}
