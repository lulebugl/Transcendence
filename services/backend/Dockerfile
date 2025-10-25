FROM node:20-alpine AS build
WORKDIR /app/services/backend

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY ./package.json ./tsconfig.json ./drizzle.config.ts ./

# Install with devDependencies for build (typescript lives in devDeps)
RUN pnpm install --frozen-lockfile=false

COPY ./srcs ./srcs
COPY ./drizzle ./drizzle

RUN pnpm build

FROM node:20-alpine AS prod
WORKDIR /app/services/backend
ENV NODE_ENV=production

COPY --from=build /app/services/backend/dist ./dist
COPY --from=build /app/services/backend/package.json ./package.json
COPY --from=build /app/services/backend/drizzle ./drizzle
COPY --from=build /app/services/backend/drizzle.config.ts ./drizzle.config.ts
# Copy db schema
COPY --from=build /app/services/backend/srcs/db ./srcs/db

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate && \
	# USE THIS FOR Production
    # pnpm install --prod --frozen-lockfile=false
    pnpm install --frozen-lockfile=false

EXPOSE 3000
CMD ["node", "dist/index.js"]

FROM node:20-alpine AS dev

WORKDIR /app/services/backend
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY package.json tsconfig.json ./
RUN pnpm install --frozen-lockfile=false

COPY srcs ./srcs
COPY database ./database
COPY drizzle ./drizzle
COPY drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

RUN pnpm db:generate
RUN pnpm db:migrate
RUN pnpm db:push

CMD ["pnpm", "dev"]
