import { useEffect, useState } from "react";
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
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
      const cachedCanvasData = localStorage.getItem("canvasData");
      if (cachedCanvasData) {
        try {
          const parsedData = JSON.parse(cachedCanvasData);
          if (Array.isArray(parsedData)) {
            setRectangles(parsedData);
          } else {
            console.warn("Cached data is not an array");
          }
        } catch (error) {
          console.error("Error parsing cached data:", error);
          localStorage.removeItem("canvasData");
        }
      } else {
        fetchDbData();
      }
    } else {
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    }
  }, [fetchDbData, setRectangles, isAuthenticated]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.type === "canvasUpdate") {
            // TODO Hier werden die Daten nicht korrekt verarbeitet. Es wird ein Array erwartet, aber nur ein Objekt wird empfangen.
            setRectangles((prevRectangles) => {
              const updatedRectangles = [...prevRectangles, ...data.data];
              localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
              return updatedRectangles;
            });
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

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

/*
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
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
      const cachedCanvasData = localStorage.getItem("canvasData");
      if (cachedCanvasData) {
        try {
          const parsedData = JSON.parse(cachedCanvasData);
          if (Array.isArray(parsedData)) {
            setRectangles(parsedData);
          } else {
            console.warn("Cached data is not an array");
          }
        } catch (error) {
          console.error("Error parsing cached data:", error);
          localStorage.removeItem("canvasData");
        }
      } else {
        fetchDbData();
      }
    } else {
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    }
  }, [fetchDbData, setRectangles, isAuthenticated]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.type === "canvasUpdate") {
            setRectangles((prevRectangles) => {
              const updatedRectangles = [...prevRectangles, data.data];
              localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
              return updatedRectangles;
            });
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

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
*/