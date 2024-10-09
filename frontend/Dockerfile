FROM node:20.18.0-alpine

WORKDIR /app

ADD package*.json .
RUN npm install -g serve && npm install

ADD . /app

RUN npm run build

CMD [ "serve", "dist" ]
