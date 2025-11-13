FROM node:20-alpine AS build
WORKDIR /app/services/frontend
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# Copy frontend service files
COPY package.json vite.config.ts index.html ./
COPY srcs ./srcs

# Install with devDependencies for build (vite lives in devDeps)
RUN pnpm install --frozen-lockfile=false
RUN pnpm build

FROM nginx:1.27-alpine AS prod
COPY --from=build /app/services/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS dev
WORKDIR /app/services/frontend
RUN apk add --no-cache curl
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY package.json ./
RUN pnpm install --frozen-lockfile=false
EXPOSE 5173
CMD ["pnpm", "dev", "--", "--host", "--port", "5173"]
