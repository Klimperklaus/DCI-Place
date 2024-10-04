import mongoose from "mongoose";

const pixelSchema = new mongoose.Schema({
  _id: String,
  position_x: Number,
  position_y: Number,
  color: String,
  timestamp: String,
});

const Pixel = mongoose.model("Pixel", pixelSchema);

export default Pixel;
