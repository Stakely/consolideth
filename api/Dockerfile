FROM node:24-alpine

RUN apk add --no-cache bash wget

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
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.dev.sh /opt/startup.relational.dev.sh
RUN chmod +x /opt/startup.relational.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.dev.sh

RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN pnpm run build

CMD ["/opt/startup.relational.dev.sh"]
