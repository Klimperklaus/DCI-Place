import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send("Testnachricht vom Server empfangen");
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          // Hier können Sie die Logik zum Speichern des neuen Rechtecks in der Datenbank hinzufügen
          // und die aktualisierten Daten an alle verbundenen Clients senden
          const canvasEntry = await Canvas.findById("1_1");
          if (canvasEntry) {
            canvasEntry.rectangles.push(newRect);
            await canvasEntry.save();
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "canvasUpdate",
                    data: canvasEntry.rectangles,
                  })
                );
              }
            });
          } else {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Canvas entry not found",
              })
            );
          }
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send("WebSocket connection established");
  } catch (err) {
    ws.close();
  }
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

export default wss;

/*
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send("Testnachricht vom Server empfangen");
        }

        if (parsedMessage.type === "fetchCanvas") {
          const canvasEntry = await Canvas.findById("1_1");
          if (canvasEntry) {
            console.log("Canvas-Daten:", canvasEntry);
            ws.send(JSON.stringify({ type: "canvasData", data: canvasEntry }));
          } else {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Canvas entry not found",
              })
            );
          }
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send("WebSocket connection established");
  } catch (err) {
    ws.close();
  }
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

export default wss;
*/
