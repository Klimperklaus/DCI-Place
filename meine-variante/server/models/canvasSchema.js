import mongoose from "mongoose";

const canvasSchema = new mongoose.Schema({
  position: {
    x: Number,
    y: Number,
  },
  color: String,
  timestamp: String,
  clickCount: Number,
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Canvas = mongoose.model("Canvas", canvasSchema);

export default Canvas;
