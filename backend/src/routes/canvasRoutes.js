import express from "express";
import Canvas from "../models/canvasModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route zum Abrufen aller Canvas-Daten
router.get("/", authMiddleware, async (req, res) => {
  try {
    const canvasData = await Canvas.find();
    res.json(canvasData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route zum Abrufen eines spezifischen Canvas-Eintrags
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const canvasEntry = await Canvas.findById(req.params.id);
    if (canvasEntry) {
      console.log("Canvas-Daten:", canvasEntry);
      res.json(canvasEntry);
    } else {
      res.status(404).json({ message: "Canvas entry not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route zum Aktualisieren eines Canvas-Eintrags
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { position_x, position_y, color, timestamp } = req.body;

  try {
    const canvasEntry = await Canvas.findById(id);
    if (!canvasEntry) {
      return res.status(404).json({ message: "Canvas entry not found" });
    }

    canvasEntry.position_x = position_x;
    canvasEntry.position_y = position_y;
    canvasEntry.color = color;
    canvasEntry.timestamp = timestamp;

    await canvasEntry.save();
    res.json(canvasEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

/*
import express from "express";
import Canvas from "../models/canvasModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route zum Abrufen aller Canvas-Daten
router.get("/", authMiddleware, async (req, res) => {
  try {
    const canvasData = await Canvas.find();
    res.json(canvasData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route zum Abrufen eines spezifischen Canvas-Eintrags
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const canvasEntry = await Canvas.findById(req.params.id);
    if (canvasEntry) {
      console.log("Canvas-Daten:", canvasEntry);
      res.json(canvasEntry);
    } else {
      res.status(404).json({ message: "Canvas entry not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route zum Aktualisieren eines Canvas-Eintrags
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { position_x, position_y, color, timestamp } = req.body;

  try {
    const canvasEntry = await Canvas.findById(id);
    if (!canvasEntry) {
      return res.status(404).json({ message: "Canvas entry not found" });
    }

    canvasEntry.position_x = position_x;
    canvasEntry.position_y = position_y;
    canvasEntry.color = color;
    canvasEntry.timestamp = timestamp;

    await canvasEntry.save();
    res.json(canvasEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
*/
