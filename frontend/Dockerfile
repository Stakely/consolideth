FROM node:20.19.0-slim AS build

# Accept build arguments
ARG VITE_API_URL=http://localhost:3000
ARG VITE_WALLET_CONNECT_PROJECT_ID=""
ARG VITE_UMAMI_PROJECT_ID=""
ARG VITE_EXPLORER_URL="https://beaconcha.in/tx"
ARG VITE_HOODI_EXPLORER_URL="https://hoodi.beaconcha.in/tx"
ARG VITE_GITHUB_REPOSITORY="https://github.com/yourusername/consolideth"

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    apt-get clean

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .

# Create .env file with build arguments
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env && \
    echo "VITE_WALLET_CONNECT_PROJECT_ID=${VITE_WALLET_CONNECT_PROJECT_ID}" >> .env && \
    echo "VITE_UMAMI_PROJECT_ID=${VITE_UMAMI_PROJECT_ID}" >> .env && \
    echo "VITE_EXPLORER_URL=${VITE_EXPLORER_URL}" >> .env && \
    echo "VITE_HOODI_EXPLORER_URL=${VITE_HOODI_EXPLORER_URL}" >> .env && \
    echo "VITE_GITHUB_REPOSITORY=${VITE_GITHUB_REPOSITORY}" >> .env

RUN yarn build

FROM nginx:alpine AS server

# Install wget for health checks
RUN apk add --no-cache wget

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
