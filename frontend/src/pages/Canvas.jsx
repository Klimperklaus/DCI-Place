import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      setIsAuthenticated(true);
      // Wenn vorhanden, Daten aus dem Cache laden
      const cachedCanvasData = localStorage.getItem("canvasData");
      if (cachedCanvasData) {
        setRectangles(JSON.parse(cachedCanvasData));
      } else {
        fetchDbData();
      }
    }
  }, [fetchDbData, setRectangles]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
        ws.send(JSON.stringify({ type: "testMessage", message: "Hello from client" }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.type === "canvasUpdate") {
            setRectangles(data.data);
            localStorage.setItem("canvasData", JSON.stringify(data.data)); // Aktualisieren der Daten im lokalen Speicher
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

  const handleWebSocketConnect = () => {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im Cookie gefunden.");
      return;
    }

    if (ws) {
      ws.close();
      setWs(null);
    } else {
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
      setWs(newWs);
    }
  };

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <button onClick={handleWebSocketConnect}>
            {ws ? "Disconnect WebSocket" : "Connect WebSocket"}
          </button>
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
*/