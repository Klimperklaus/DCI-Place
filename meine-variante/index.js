import express from "express";
import { WebSocketServer } from "ws";
import { jwtVerify } from "jose";

const app = express();
const PORT = 3000;
const SECRET_KEY = new TextEncoder().encode("test_key"); // Verwenden Sie eine sicherere Methode zur Verwaltung von Schlüsseln

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hallo! Du bist zuhause.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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

  ws.send(
    JSON.stringify({
      message: "Testnachricht vom Server",
      position: { x: 0, y: 0 },
    })
  );
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});
