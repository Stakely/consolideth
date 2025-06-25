FROM node:20.11.1-alpine

# Add build argument for Sentry auth token
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./startup.relational.prod.sh /opt/startup.relational.prod.sh
RUN chmod +x /opt/startup.relational.prod.sh
RUN sed -i 's/\r//g' /opt/startup.relational.prod.sh

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then touch .env; fi
# Build with Sentry token available
RUN SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} npm run build

CMD ["/opt/startup.relational.prod.sh"]