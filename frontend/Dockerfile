# Basis Image
FROM node:20.18.0-alpine

# User (sollte nie root sein)
# USER node

# Arbeitsverzeichnis in welchem alle Befehle ausgefuehrt werden
WORKDIR /app

ADD package*.json .
RUN npm install -g serve && npm install

ADD . /app

RUN npm run build

CMD [ "serve", "dist" ]
