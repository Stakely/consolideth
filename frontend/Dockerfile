FROM node:20.19.0-slim AS build

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    apt-get clean

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .

RUN yarn build

FROM nginx:alpine AS server
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
