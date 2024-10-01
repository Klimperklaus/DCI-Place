import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "./models/canvasModel.js"; // Import Canvas model

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// CORS-Anfragen vom Frontend erlauben
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api", routes);
app.use(errorHandler);

// MongoDB-Verbindungen
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

const canvasConnection = mongoose.createConnection(
  process.env.CANVAS_MONGO_URI
);
canvasConnection.on("connected", () => {
  console.log("Canvas MongoDB connected");
});
canvasConnection.on("error", (err) => {
  console.log(`Canvas MongoDB connection error: ${err.message}`);
});

// WebSocket-Server
const wss = new WebSocketServer({ port: 3131 });

wss.on("connection", function connection(ws, req) {
  const token = req.url.split("token=")[1];
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

        // Testnachricht empfangen
        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send("Testnachricht vom Server empfangen");
        }

        // Canvas-Daten abrufen und ausgeben
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
