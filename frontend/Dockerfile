FROM node:24-slim AS build

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV CI=true
RUN corepack enable \
  && corepack prepare pnpm@11.1.2 --activate

# pnpm-workspace.yaml carries the quarantine window and the allowBuilds
# verdicts, so it has to be there before the install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:alpine AS server

# Install wget for health checks
RUN apk add --no-cache wget

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
