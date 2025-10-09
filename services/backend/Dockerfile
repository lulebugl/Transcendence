FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# Copy workspace files (context is project root)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy backend service files
COPY services/backend/package.json services/backend/tsconfig.json services/backend/drizzle.config.ts ./services/backend/

# Install with devDependencies for build (typescript lives in devDeps)
RUN pnpm install --filter @app/backend... --frozen-lockfile=false

COPY services/backend/src ./services/backend/src
COPY services/backend/drizzle ./services/backend/drizzle

RUN pnpm --filter @app/backend build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/services/backend/dist ./dist
COPY --from=build /app/services/backend/package.json ./package.json
COPY --from=build /app/services/backend/drizzle ./drizzle
COPY --from=build /app/services/backend/drizzle.config.ts ./drizzle.config.ts
# Copy db schema
COPY --from=build /app/services/backend/src/db ./src/db

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate && \
    # pnpm install --prod --frozen-lockfile=false && \ USE THIS FOR CORRECTION
    pnpm install --frozen-lockfile=false

EXPOSE 3000
CMD ["node", "dist/index.js"]

