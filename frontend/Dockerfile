# Frontend Dockerfile (Vite)
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# Quellcode kopieren
COPY . .

# Port festlegen
EXPOSE 5173

# Entwicklungsserver starten
CMD ["npm", "run", "dev"]