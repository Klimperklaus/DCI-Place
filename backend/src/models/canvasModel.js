import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Verbindung zur zweiten MongoDB-Datenbank herstellen
const canvasConnection = mongoose.createConnection(
  process.env.CANVAS_MONGO_URI
);

const canvasSchema = new mongoose.Schema({
  _id: String,
  rectangles: [
    {
      position_x: Number,
      position_y: Number,
      color: String,
      timestamp: String,
    },
  ],
});

const Canvas = canvasConnection.model("Canvas", canvasSchema);

export default Canvas;
