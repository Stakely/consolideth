FROM node:24-alpine

RUN apk add --no-cache bash

WORKDIR /usr/src/app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV CI=true
RUN corepack enable \
  && corepack prepare pnpm@11.1.2 --activate

# pnpm-workspace.yaml carries the quarantine window and the allowBuilds
# verdicts, so it has to be there before the install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . /usr/src/app
COPY ./startup.relational.prod.sh /opt/startup.relational.prod.sh
RUN chmod +x /opt/startup.relational.prod.sh
RUN sed -i 's/\r//g' /opt/startup.relational.prod.sh

RUN if [ ! -f .env ]; then touch .env; fi
# Build the application
RUN pnpm run build

CMD ["/opt/startup.relational.prod.sh"]
