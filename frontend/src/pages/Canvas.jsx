
import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import WebSocketClient from "../components/WebSocketClient.jsx";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [canvasData, setCanvasData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      setIsAuthenticated(true);
      // Wenn vorhanden, Daten aus dem Cache laden
      const cachedCanvasData = localStorage.getItem("canvasData");
      if (cachedCanvasData) {
        setCanvasData(JSON.parse(cachedCanvasData));
      }
      else {
        fetchCanvasData(token);
      }
    }
    else {
      setIsReadOnly(true);
}
  }, []);

  return (
    <div className="canvas-container">
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
        />
      </div>
    </div>
  );
};

export default Canvas;