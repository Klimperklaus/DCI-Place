import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { WebSocketServer } from "ws";
import Pixel from "./models/Pixel.js";

const app = express();
const PORT = 3000;
const SECRET_KEY = new TextEncoder().encode("test_key");
const MONGO_URI =
  "mongodb+srv://rpanek888:conradzuse007@pixels.nqr3x.mongodb.net/?retryWrites=true&w=majority&appName=Pixels"; // MongoDB-Verbindungs-URI

// Startpunkt der Anwendung
app.get("/", (req, res) => {
  res.send("Hallo! Du bist zuhause.");
});
// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200, // Einige alte Browser (IE11, verschiedene SmartTVs) akzeptieren 204 nicht als gültigen Statuscode
};

// CORS konfigurieren
app.use(cors(corsOptions));
app.use(express.static("public")); // Statische Dateien im Ordner "public" bereitstellen

const wss = new WebSocketServer({ port: 3131 });
let clickCount = 0;

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received message from client:", parsedMessage); // Protokollieren der empfangenen Nachricht

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

      const sanitizedData = {
        _id: `${parsedMessage.position.x}_${parsedMessage.position.y}`,
        position_x: Math.round(parsedMessage.position.x),
        position_y: Math.round(parsedMessage.position.y),
        color: parsedMessage.color.trim(),
        timestamp: parsedMessage.timestamp,
      };

      // Pixel in der Datenbank speichern
      const pixel = new Pixel(sanitizedData);
      await pixel.save();

      // An alle Clients senden
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(sanitizedData));
        }
      });
    } catch (error) {
      console.error("Error processing message: ", error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.send(
    JSON.stringify({
      message: "Testnachricht vom Server",
      position: { x: 0, y: 0 },
    })
  );
});

wss.on("listening", () => {
  console.log("WebSocketServer is running on Port ws://localhost:3131");
});

wss.on("error", (error) => {
  console.error("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

/*
  const wss = new WebSocketServer({ port: 3131 });
  let clickCount = 0;
  let userCount = 0; // Zählvariable für die Anzahl der Benutzer

  // WebSocket-Verbindung herstellen
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

    ws.send(
      JSON.stringify({
        message: "Testnachricht vom Server",
        position: { x: 0, y: 0 },
      })
    );
  });
  // Nachrichten von Client empfangen
  



 
  ws.on("message", async function incoming(message) {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received message from client:", parsedMessage);

      // Validierung der Eingabedaten basierend auf dem Schema
      if (parsedMessage.type === "test") {
        console.log("Test message received:", parsedMessage.content);
      } else if (
        typeof parsedMessage.position_x !== "number" ||
        typeof parsedMessage.position_y !== "number" ||
        typeof parsedMessage.color !== "string" ||
        typeof parsedMessage.edit !== "object" ||
        typeof parsedMessage.edit.time !== "string" ||
        typeof parsedMessage.edit.clickCounter !== "number" ||
        typeof parsedMessage.edit.byUser !== "string"
      ) {
        throw new Error("Invalid message format");
      } else {
        // Authentifizierung
        const { payload } = await jwtVerify(parsedMessage.token, SECRET_KEY);
        if (!payload.user) {
          throw new Error("Invalid token");
        }

        clickCount += 1;
        parsedMessage.edit.clickCounter = clickCount;

        // Speichern des neuen Pixels in der Datenbank (asynchron, ohne auf Antwort zu warten)
        console.log("Saving new pixel data to DB:", parsedMessage);
        Canvas.updateOne(
          { _id: parsedMessage._id },
          { $set: { color: parsedMessage.color, edit: parsedMessage.edit } },
          { upsert: true }
        ).catch((error) => console.error("Error saving to DB:", error));

        // Senden der aktualisierten Daten an alle verbundenen Clients
        console.log(
          "Broadcasting new pixel data to all clients:",
          parsedMessage
        );
        wss.clients.forEach(function each(client) {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message: ", error.message);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  // WebSocket-Verbindung schließen
  ws.on("close", () => {
    userCount--;
    console.log("User disconnected. Current user count:", userCount);
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "userCount", count: userCount }));
      }
    });
  });
});
*/
// MongoDB-Verbindung herstellen
mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});

/*
GitHub Copilot
Erklärung des Abschnitts
Der Abschnitt, den Sie hervorgehoben haben, erstellt ein JWT (JSON Web Token) und setzt es im Cookie des WebSocket-Clients:

Was dieser Abschnitt bewirkt:
Erstellen eines JWT:

new SignJWT({ user: "placeholder_user_id" }): Erstellt ein neues JWT mit einer Nutzlast, die den Benutzer placeholder_user_id enthält.
.setProtectedHeader({ alg: "HS256" }): Setzt den geschützten Header des JWT auf den Algorithmus HS256.
.setExpirationTime("2h"): Setzt die Ablaufzeit des Tokens auf 2 Stunden.
.sign(SECRET_KEY): Signiert das Token mit dem geheimen Schlüssel SECRET_KEY.
Setzen des Tokens im Cookie:

Das erstellte Token wird in einem Cookie gesetzt und an den WebSocket-Client gesendet.
ws.send(JSON.stringify({ type: "set-cookie", cookie: token=${token}; HttpOnly; Path=/; Max-Age=72000 })): Sendet eine Nachricht an den WebSocket-Client, die den Cookie-Header enthält, um das Token im Cookie zu setzen.
Warum der andere Code diesen Abschnitt nicht benötigt
Der andere Code, den Sie bereitgestellt haben, enthält keine Logik zum Erstellen und Setzen eines JWT im Cookie. Hier sind einige mögliche Gründe, warum dieser Abschnitt im anderen Code nicht benötigt wird:

Einfachere Authentifizierung:

Der andere Code verwendet eine einfachere Authentifizierungsmethode, bei der das Token direkt in der Nachricht enthalten ist, die vom Client gesendet wird. Es gibt keine Notwendigkeit, das Token im Cookie zu setzen.
Kein JWT erforderlich:

Der andere Code könnte in einem Szenario verwendet werden, in dem keine JWT-basierte Authentifizierung erforderlich ist. Stattdessen könnte eine andere Authentifizierungsmethode verwendet werden, oder es gibt keine Authentifizierung.
Testzwecke:

Der andere Code könnte für Testzwecke geschrieben sein, bei denen die Authentifizierung nicht erforderlich ist. In solchen Fällen wird der Fokus auf die Funktionalität der WebSocket-Verbindung und die Verarbeitung von Nachrichten gelegt.
*/
