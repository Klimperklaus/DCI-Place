import express from "express"; // Import the Express framework
import Canvas from "../models/canvasModel.js"; // Import the Canvas model for database operations
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware to secure routes

const router = express.Router(); // Create a new router instance

// Route zum Abrufen aller Canvas-Daten
router.get("/", authMiddleware, async (req, res) => {
  try {
    const canvasData = await Canvas.find(); // Find all canvas entries in the database
    console.log("Alle Canvas-Daten:", canvasData); // Log fetched data for debugging purposes
    res.json(canvasData); // Send the fetched data as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors by sending a 500 status with error details
  }
});

// Route zum Abrufen eines spezifischen Canvas-Eintrags
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const canvasEntry = await Canvas.findById(req.params.id); // Find a specific canvas entry by its ID
    if (canvasEntry) {
      console.log("Canvas-Daten:", canvasEntry); // Log the fetched data for debugging purposes
      res.json(canvasEntry); // Send the fetched data as a JSON response
    } else {
      res.status(404).json({ message: "Canvas entry not found" }); // If no entry is found, send a 404 error with a custom message
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors by sending a 500 status with error details
  }
});

// Route zum Aktualisieren eines Canvas-Eintrags
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { position_x, position_y, color, timestamp } = req.body; // Extract properties from the request body

  try {
    const canvasEntry = await Canvas.findById(id); // Find the specific canvas entry to update
    if (!canvasEntry) {
      return res.status(404).json({ message: "Canvas entry not found" }); // If no entry is found, send a 404 error with a custom message and stop further execution
    }

    canvasEntry.position_x = position_x; // Update the position_x property
    canvasEntry.position_y = position_y; // Update the position_y property
    canvasEntry.color = color; // Update the color property
    canvasEntry.timestamp = timestamp; // Update the timestamp property

    await canvasEntry.save(); // Save the updated entry back to the database
    res.json(canvasEntry); // Send the updated data as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors by sending a 500 status with error details
  }
});

export default router; // Export the configured router for use in other parts of the application
