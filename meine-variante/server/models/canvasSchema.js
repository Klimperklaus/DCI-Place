import mongoose from "mongoose";

const canvasSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  color: String,
  timestamp: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Canvas = mongoose.model("Canvas", canvasSchema);

export default Canvas;
