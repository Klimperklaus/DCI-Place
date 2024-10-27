import { useEffect, useState, useCallback } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get("token_js");

    if (token) {
      // If the user is not authenticated, set it to true
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }

      // Attempt to retrieve cached canvas data from localStorage
      const cachedCanvasData = localStorage.getItem("canvasData");

      if (cachedCanvasData) {
        try {
          // Parse the cached data and check if it's an array
          const parsedData = JSON.parse(cachedCanvasData);

          if (Array.isArray(parsedData)) {
            // If it's an array, set the rectangles state with this data
            setRectangles(parsedData);
          } else {
            console.warn("Cached data is not an array");
          }
        } catch (error) {
          // Handle parsing errors by logging them and removing the invalid cache
          console.error("Error parsing cached data:", error);
          localStorage.removeItem("canvasData");
        }
      } else {
        // If there's no cached data, fetch the data from the database
        fetchDbData();
      }
    } else {
      // If a token is not present, ensure the user is marked as not authenticated
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    }
  }, [fetchDbData, setRectangles, isAuthenticated]);

  useEffect(() => {
    // Check if the WebSocket instance is available
    if (ws) {
      // Event handler for when the connection to the WebSocket server opens
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected"); // Update the connection status to "Connected"
      };

      // Event handler for when a message is received from the WebSocket server
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Parse the incoming message as JSON
          console.log("Data received from WebSocket:", data); // Log the parsed data to the console

          if (data.type === "canvasUpdate") {
            setRectangles((prevRectangles) => {
              const updatedRectangles = [...prevRectangles, data.data]; // Update the rectangles with new data from server
              localStorage.setItem(
                "canvasData",
                JSON.stringify(updatedRectangles) // Store the updated rectangles in local storage
              );
              return updatedRectangles;
            });
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error); // Log any errors during JSON parsing to the console
        }
      };

      // Event handler for when an error occurs with the WebSocket connection
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error); // Log the error to the console
      };

      // Event handler for when the WebSocket connection is closed
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected"); // Update the connection status to "Disconnected"
      };
    }
  }, [ws, setRectangles]); // Run this effect whenever 'ws' or 'setRectangles' changes

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <div className="stage-container">
            <CanvasComponent
              selectedColor={selectedColor}
              ws={ws}
              setCoordinates={setCoordinates}
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;
