FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY services/backend/package.json services/backend/tsconfig.json ./services/backend/

# Install with devDependencies for build (typescript lives in devDeps)
RUN pnpm install --filter @app/backend... --frozen-lockfile=false

COPY services/backend/src ./services/backend/src

RUN pnpm --filter @app/backend build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps for runtime
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY services/backend/package.json ./services/backend/package.json
RUN pnpm install --filter @app/backend... --prod --frozen-lockfile=false

# Copy built app
COPY --from=build /app/services/backend/dist ./dist
COPY --from=build /app/services/backend/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/index.js"]

