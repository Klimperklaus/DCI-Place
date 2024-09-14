# Express Dockerfile
FROM node:18-alpine

# Arbeitsverzeichnis im Container erstellen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json package-lock.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# Port festlegen
EXPOSE 3000

# Backend starten
CMD ["npm", "start"]