# Frontend Dockerfile
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren 
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Quellcode kopieren
COPY . .

# Port festlegen
EXPOSE 5173

# Entwicklungsserver starten
CMD ["npm", "run", "dev"]