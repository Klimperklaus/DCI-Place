import { useState, useEffect } from "react";
import WebSocketComponent from "./WebSocketComponent";
import Canvas from "./canvas";
import ColorPicker from "./ColorPicker";
import "./App.css";

function App() {
  // Zustandsvariablen initialisieren
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedColor, setSelectedColor] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState("");
  const [rectangles, setRectangles] = useState([]);
  const [wsData, setWsData] = useState([]);
  const [mongodbData, setMongodbData] = useState([]);
  const [testMessage, setTestMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [error, setError] = useState("");

  // Funktion zum Inkrementieren des Klickzählers
  const incrementClickCount = () => {
    setClickCount(clickCount + 1);
  };

  // Effekt-Hook, der bei Änderungen des "rectangles"-Zustands ausgeführt wird
  useEffect(() => {
    console.log("Rectangles state updated:", rectangles);
  }, [rectangles]);

  // Effekt-Hook, der bei Änderungen des "connectionStatus"-Zustands ausgeführt wird
  useEffect(() => {
    // Überprüfen, ob die Verbindung hergestellt ist
    if (connectionStatus === "Connected") {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [connectionStatus]);

  // Effekt-Hook, der beim ersten Rendern der Komponente ausgeführt wird
  useEffect(() => {
    // Token aus dem Cookie auslesen
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (cookieToken) {
      setToken(cookieToken);
    }
  }, []);

  // Funktion zum Senden einer Testnachricht über WebSocket
  const sendTestMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = { type: "test", content: "This is a test message" };
      ws.send(JSON.stringify(message));
      setTestMessage(JSON.stringify(message));
    }
  };

 return (
    <div className="App">
      <h1>Small Playground For WebSocket-Applications</h1>
      <div className="card">
        <h3>WebSocket Client</h3>
        <p>Drücken Sie den untenstehenden Button, um eine Verbindung zum WebSocket herzustellen und zu trennen</p>
        <WebSocketComponent
          setWs={setWs}
          setConnectionStatus={setConnectionStatus}
          setMessages={setMessages}
          setWsData={setWsData}
          setError={setError}
        />
        <div className="traffic-light">
          <div className={`light ${connectionStatus === "Disconnected" ? "red" : connectionStatus === "Connected" ? "green" : "yellow"}`}></div>
        </div>
        <p>Verbindung: <span style={{ color: "orange" }}>{connectionStatus}</span></p>
        <p>Client: <span style={{ color: "orange" }}>{window.location.hostname}</span></p>
        <p>Server: <span style={{ color: "orange" }}>{ws ? ws.url.slice(5) : ""}</span></p>
        <p>Error: <span style={{ color: "red" }}>{error}</span></p>
        <h3>Verbinden, Farbe wählen und in den Canvas klicken, um WebSocket und MongoDB zu testen</h3>
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          isConnected={isConnected}
        />
        <Canvas
          ws={ws}
          selectedColor={selectedColor}
          incrementClickCount={incrementClickCount}
          rectangles={rectangles}
          setRectangles={setRectangles}
          isConnected={isConnected}
          currentUser={{ id: "Platzhalter" }}
          setMongodbData={setMongodbData}
        />
        <div>
          <button onClick={sendTestMessage}>Send Test Message</button>
          <div>Gesendet: {testMessage}</div>
          <div>Empfangen: {receivedMessage}</div>
        </div>
        <div id="ws-box">
          <h3>WebSocket Daten</h3>
          <p>{wsData.join(", ")}</p>
        </div>
        <div id="mongodb-box">
          <h3>MongoDB Daten</h3>
          <p>{mongodbData.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}

export default App;