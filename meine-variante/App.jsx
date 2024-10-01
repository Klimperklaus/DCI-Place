import { useState, useRef, useEffect } from "react";
import WebSocketComponent from "./WebSocketComponent";
import Canvas from "./canvas";
import ReadOnlyCanvas from "./ReadOnlyCanvas";
import ColorPicker from "./ColorPicker";
import useFetchCanvasData from "./useFetchCanvasData";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedColor, setSelectedColor] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const { rectangles, setRectangles, dbRectangles, fetchDbData } = useFetchCanvasData();

  const incrementClickCount = () => {
    setClickCount(clickCount + 1);
  };


  useEffect(() => {
    console.log("Rectangles state updated:", rectangles); // Log Rechtecke im Zustand
  }, [rectangles]);

  return (
    <div className="App">
      <h1>Small Playground For WebSocket-Applications</h1>
      <div className="card">
        <h3>WebSocket Client</h3>
        <p>Press buttons below to connect and disconnect from WebSocket</p>
        <WebSocketComponent
          setWs={setWs}
          setConnectionStatus={setConnectionStatus}
          setMessages={setMessages}
        />
        <p>Connection: <span style={{ color: "orange" }}>{connectionStatus}</span></p>
        <p>Client: <span style={{ color: "orange" }}>{window.location.hostname}</span></p>
        <p>Server: <span style={{ color: "orange" }}>{ws ? ws.url.slice(5) : ""}</span></p>
        <h3>Place a pixel in the canvas below to test WebSocket</h3>
        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        <Canvas
          ws={ws}
          selectedColor={selectedColor}
          incrementClickCount={incrementClickCount}
          rectangles={rectangles}
          setRectangles={setRectangles}
        />
        <h3>Read-Only Canvas (Database State)</h3>
        <button onClick={fetchDbData}>Fetch DB Data</button>
        <ReadOnlyCanvas rectangles={dbRectangles} />
      </div>
      <div className="card">
        <div style={{ display: "flex" }}>
          <ul id="ws-box" style={{ flex: 1 }}>
            <h2>Data-Stream from Websocket-Server on ws://localhost:3131</h2>
            {rectangles.slice().reverse().map((wsrect, index) => (
              <li key={index}>
                <span style={{ color: "black" }}>
                  (x: {wsrect.position?.x}, y: {wsrect.position?.y}) - Color: {wsrect.color} - Timestamp: {wsrect.timestamp} - UserID: {wsrect.userId} - Click Count: {wsrect.clickCount}
                </span>
              </li>
            ))}
          </ul>
          <ul id="mongodb-box" style={{ flex: 1 }}>
            <h2>Messages from mongoDB-Server on ws://localhost:3000</h2>
            {dbRectangles.slice().reverse().map((dbrect, index) => (
              <li key={index}>
                <span style={{ color: "black" }}>
                  (x: {dbrect.position?.x}, y: {dbrect.position?.y}) - Color: {dbrect.color} - Timestamp: {dbrect.timestamp} - Click Count: {dbrect.clickCount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;