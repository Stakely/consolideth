FROM node:20.11.1-alpine



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
# Build the application
RUN npm run build

CMD ["/opt/startup.relational.prod.sh"]