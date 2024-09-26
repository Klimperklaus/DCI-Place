import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SECRET_KEY_WS = process.env.SECRET_KEY_WS;

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://192.168.178.75:3000/",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api", routes);
app.use(errorHandler);
app.use(express.static("public"));

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

const wss = new WebSocketServer({ port: 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");

  if (!token) {
    console.error("No token provided");
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_WS);
    console.log("Authenticated user:", decoded.user);

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

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

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.send(
      JSON.stringify({
        message: "Testnachricht vom Server :)",
        position: { x: 0, y: 0 },
        color: "black",
        timestamp: new Date().toISOString(),
        clickCount: { clickCount },
      })
    );
  } catch (error) {
    console.error("JWT verification failed:", error);
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
