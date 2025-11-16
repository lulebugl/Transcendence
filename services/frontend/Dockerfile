FROM node:20-alpine AS build
WORKDIR /app/services/frontend
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile=false

COPY tsconfig.json vite.config.ts eslint.config.js ./
COPY index.html ./

COPY srcs ./srcs
COPY public ./public

RUN pnpm build

FROM nginx:1.27-alpine AS prod
COPY --from=build /app/services/frontend/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS dev
WORKDIR /app/services/frontend
RUN apk add --no-cache curl
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile=false

COPY tsconfig.json vite.config.ts eslint.config.js ./
COPY index.html ./

COPY srcs ./srcs
COPY public ./public

EXPOSE 5173
CMD ["pnpm", "dev", "--", "--host", "--port", "5173"]
