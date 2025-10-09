FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

# Copy workspace files (context is project root)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy frontend service files
COPY services/frontend/package.json services/frontend/vite.config.ts services/frontend/index.html ./services/frontend/
COPY services/frontend/src ./services/frontend/src

# Install with devDependencies for build (vite lives in devDeps)
RUN pnpm install --filter @app/frontend... --frozen-lockfile=false
RUN pnpm --filter @app/frontend build

FROM nginx:1.27-alpine
COPY --from=build /app/services/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

