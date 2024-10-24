
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

// TO-DO: die fetchCanvasData Funktion implementieren. Diese soll zuerst überprüfen
// ob Daten im localStorage vorhanden sind und diese zurückgeben. MUSS NOCH IMPLEMENTIERT WERDEN!!!
  // Ansonsten soll sie das modul useFetchCanvasData verwenden, um die Daten vom Server zu holen und 
  // im localStorage zu speichern. 
  // Die Funktion soll nur ausgeführt werden, wenn der Token vorhanden 
  // ist und die Daten noch nicht geladen wurden. MUSS NOCH IMPLEMENTIERT WERDEN!!!
// TO-DO: ws-Verbindung beim betreten des Canvas aufbauen und beim verlassen des Canvas schließen.
// entweder hier oder in CanvasComponent.jsx implementieren. MUSS NOCH IMPLEMENTIERT WERDEN!!!

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