FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy frontend service files
COPY services/frontend/package.json services/frontend/vite.config.ts services/frontend/index.html ./services/frontend/
COPY services/frontend/srcs ./services/frontend/srcs

# Install with devDependencies for build (vite lives in devDeps)
RUN pnpm install --filter @app/frontend... --frozen-lockfile=false
RUN pnpm --filter @app/frontend build

FROM nginx:1.27-alpine AS prod
COPY --from=build /app/services/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY services/frontend/package.json ./services/frontend/
RUN pnpm install --filter @app/frontend... --frozen-lockfile=false
EXPOSE 5173
CMD ["pnpm","--filter","@app/frontend","dev","--","--host","--port","5173"]
