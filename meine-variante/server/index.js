import express from "express";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Canvas from "./models/canvasSchema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key"; // Geheimnis für JWT

// CORS-Anfragen vom Frontend erlauben
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200, // Einige alte Browser (IE11, verschiedene SmartTVs) akzeptieren 204 nicht als gültigen Statuscode
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.static("public")); // Statische Dateien im Ordner "public" bereitstellen

app.get("/", (req, res) => {
  res.send("Hallo! Du bist zuhause.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Verbindung zu MongoDB herstellen
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/canvasDB";

mongoose.connect(mongoURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});

// Route zum Abrufen der Canvas-Daten
app.get("/api/canvas", async (req, res) => {
  try {
    const data = await Canvas.find({}).select("-_id -__v");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching canvas data" });
  }
});

// Route zum Abrufen der Canvas-Daten für einen bestimmten Benutzer
app.get("/api/canvas/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Canvas.find({ userId: userId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching canvas data" });
  }
});

const wss = new WebSocketServer({ port: 3131 });
let clickCount = 0;
let userCount = 0; // Zählvariable für die Anzahl der Benutzer

wss.on("connection", async function connection(ws) {
  // Erhöhen der Benutzeranzahl bei einer neuen Verbindung
  userCount++;
  // Senden der aktuellen Benutzeranzahl an alle verbundenen Clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify({ type: "userCount", count: userCount }));
    }
  });

  // Generieren eines JWT beim Verbindungsaufbau
  const token = jwt.sign({ user: "user" }, SECRET_KEY, { expiresIn: "2h" });

  // Senden der gespeicherten Pixel-Daten an den neuen Client
  const pixelData = await Canvas.find({});
  ws.send(JSON.stringify({ type: "initialData", data: pixelData }));

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
      const payload = jwt.verify(token, SECRET_KEY);
      if (!payload.user) {
        throw new Error("Unauthorized");
      }

      clickCount += 1;
      parsedMessage.clickCount = clickCount;
      parsedMessage.userId = payload.userId; // Benutzer-ID hinzufügen

      // Speichern des neuen Pixels in der Datenbank
      const newPixel = new Canvas(parsedMessage);
      await newPixel.save();

      wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error("Error processing message: ", error.message);
      console.error("Received message: ", message.toString());
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on("close", () => {
    // Verringern der Benutzeranzahl bei einer Trennung
    userCount--;
    // Senden der aktuellen Benutzeranzahl an alle verbundenen Clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "userCount", count: userCount }));
      }
    });
  });

  ws.send(
    JSON.stringify({
      message: "Testnachricht vom Server",
      position: { x: 0, y: 0 },
      token: token, // Senden des JWT an den Client
    })
  );
});
