// server.js

import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Importieren des WebSocket-Servers und des JWT-Verifizierers
import { WebSocketServer } from "ws";
import { jwtVerify } from "jose";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Key zum erstellen und verifizieren von JWTs im Websocket-Server hinzu gefügt
const SECRET_KEY_WS = new TextEncoder().encode(process.env.SECRET_KEY_WS);

const app = express();

// CORS-Anfragen vom Frontend erlauben
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200,
};

// Middlwares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api", routes);
app.use(errorHandler);
app.use(express.static("public"));

// MongoDB-Verbindung
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err.message}`);
  });

// Verbindung zum WebSocketServer auf Port 3131 herstellen
const wss = new WebSocketServer({ port: 3131 });
let clickCount = 0;

wss.on("connection", function connection(ws) {
  ws.on("message", async function incoming(message) {
    try {
      const parsedMessage = JSON.parse(message);

      // Validierung der Eingabedaten
      if (
        !parsedMessage.position ||
        typeof parsedMessage.position.x !== "number" ||
        typeof parsedMessage.position.y !== "number" ||
        !parsedMessage.color ||
        typeof parsedMessage.color !== "string" ||
        !parsedMessage.timestamp ||
        typeof parsedMessage.timestamp !== "string"
      ) {
        throw new Error("Invalid message format");
      }

      // Authentifizierung
      if (!parsedMessage.token) {
        throw new Error("Unauthorized");
      }

      const { payload } = await jwtVerify(parsedMessage.token, SECRET_KEY);
      if (!payload.user) {
        throw new Error("Unauthorized");
      }

      clickCount += 1;
      parsedMessage.clickCount = clickCount;

      wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error("Error processing message: ", error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  // Eine Testnachricht wird an den Client gesendet.
  ws.send(
    JSON.stringify({
      message: "Testnachricht vom Server",
      position: { x: 0, y: 0 },
      color: "black",
      timestamp: new Date().toISOString(),
      clickCount: { clickCount },
    })
  );
});

// Event-Handler für den WebSocketServer, Status des Servers im Terminal anzeigen
wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

// Error-Handler für den WebSocketServer
wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

// Close-Handler für den WebSocketServer
wss.on("close", () => {
  console.log("WebSocketServer closed");
});
