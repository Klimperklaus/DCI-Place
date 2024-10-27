// Import necessary modules and dependencies
import { WebSocketServer } from "ws"; // Import the WebSocket server implementation
import jwt from "jsonwebtoken"; // Import JSON Web Token library for handling JWT tokens
import Canvas from "../models/canvasModel.js"; // Import the Canvas model for database operations
import dotenv from "dotenv"; // Import dotenv to load environment variables from a .env file

// Load environment variables from .env file
dotenv.config();

// Create a new WebSocketServer instance and assign it to the variable 'wss'
const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

// Event listener for when a client connects to the WebSocket server
wss.on("connection", function connection(ws, req) {
  // Extract the token from the query parameters of the request URL
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");

  // If no token is provided, close the WebSocket connection and return
  if (!token) {
    ws.close();
    return;
  }

  try {
    // Verify the JWT token using the secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the WebSocket object for later use
    ws.user = decoded;

    // Event listener for when a message is received from the client
    ws.on("message", async function incoming(message) {
      try {
        // Parse the incoming message as JSON
        const parsedMessage = JSON.parse(message);

        // Check if the message type is 'testMessage' and log it, then send a response
        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        // Handle canvas update event by updating the corresponding database entry and broadcasting the change to all clients
        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;

          // Update or create a record in the Canvas collection based on the position of the rectangle
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true }
          );

          // Retrieve all rectangles from the Canvas collection to broadcast their updated state to clients
          const allRectangles = await Canvas.find({});

          // Iterate over all connected clients and send them an update if they are open
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: allRectangles,
                })
              );
            }
          });
        }
      } catch (err) {
        // If an error occurs, send an error message back to the client
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    // Event listeners for when the WebSocket connection is closed or encounters an error
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send a confirmation message to the client indicating that the connection has been established
    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    // If an error occurs during token verification or other processes, close the WebSocket connection
    ws.close();
  }
});

// Event listeners for when the WebSocket server starts listening, encounters an error, or is closed
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

// Export the WebSocket server instance for use in other parts of the application
export default wss;
