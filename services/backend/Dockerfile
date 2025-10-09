FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

# Copy workspace files (context is project root)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy backend service files
COPY services/backend/package.json services/backend/tsconfig.json ./services/backend/

# Install with devDependencies for build (typescript lives in devDeps)
RUN pnpm install --filter @app/backend... --frozen-lockfile=false

COPY services/backend/src ./services/backend/src

RUN pnpm --filter @app/backend build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy built app first
COPY --from=build /app/services/backend/dist ./dist
COPY --from=build /app/services/backend/package.json ./package.json

# Install only production deps in the app directory
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate && \
    pnpm install --prod --frozen-lockfile=false

EXPOSE 3000
CMD ["node", "dist/index.js"]

