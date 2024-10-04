import mongoose from "mongoose";

// Definiere das Schema für die Canvas-Dokumente
const canvasSchema = new mongoose.Schema({
  _id: String, // ID des Canvas-Dokuments
  position_x: Number, // X-Position des Canvas-Elements
  position_y: Number, // Y-Position des Canvas-Elements
  color: String, // Farbe des Canvas-Elements
  edit: {
    time: String, // Zeitpunkt der Bearbeitung
    clickCounter: Number, // Anzahl der Klicks
    byUser: String, // Benutzer, der die Bearbeitung durchgeführt hat (Referenz zur User-Collection)
  },
});

// Erstelle das Canvas-Modell basierend auf dem Schema
const Canvas = mongoose.model("Canvas", canvasSchema);

export default Canvas;

// userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referenz zur User-Collection
