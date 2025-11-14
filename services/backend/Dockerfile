FROM node:20-alpine AS build
WORKDIR /app/services/backend

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY ./package.json ./tsconfig.json ./drizzle.config.ts ./

RUN pnpm install --frozen-lockfile=false

COPY ./srcs ./srcs
COPY ./drizzle ./drizzle
COPY ./docker-entrypoint.sh ./docker-entrypoint.sh

RUN pnpm build

# typescript doesn't compile js files so they need to be copied manually
# but maybe we shouldn't have js aside maybe from exception
RUN find ./srcs -name "*.js" -type f -exec cp {} ./dist/ \;

FROM node:20-alpine AS prod
WORKDIR /app/services/backend
ENV NODE_ENV=production

COPY --from=build /app/services/backend/dist ./dist
COPY --from=build /app/services/backend/package.json ./package.json
COPY --from=build /app/services/backend/drizzle ./drizzle
COPY --from=build /app/services/backend/drizzle.config.ts ./drizzle.config.ts
# Copy db schema
COPY --from=build /app/services/backend/srcs/db ./srcs/db
COPY --from=build /app/services/backend/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate && \
    pnpm install --frozen-lockfile=false


EXPOSE 3000
CMD ["./docker-entrypoint.sh", "node", "dist/index.js"]

FROM node:20-alpine AS dev

WORKDIR /app/services/backend
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY package.json tsconfig.json ./
RUN pnpm install --frozen-lockfile=false

COPY srcs ./srcs
COPY database ./database
COPY drizzle ./drizzle
COPY drizzle.config.ts ./drizzle.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh", "pnpm", "dev"]
