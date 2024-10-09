FROM node:20.18.0-alpine

WORKDIR /app

ADD . /app

RUN npm install

EXPOSE 5000

CMD [ "node", "server.js" ]