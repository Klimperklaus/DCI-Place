import { useState, useEffect, useRef } from "react";
import "./App.css";
import Canvas from "./Canvas";


function App() {
  const [messages, setMessages] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [ws, setWs] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedColor, setSelectedColor] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const inputRef = useRef(null);

  const colors = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white",
    "cyan", "magenta", "lime", "maroon", "navy", "olive", "teal", "violet", "gold", "silver"
  ];

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.error("Server error: ", data.error);
          } else {
            console.log("Message from server: ", data);
            setMessages((prevMessages) => [data, ...prevMessages]);
            if (data.position && data.color) {
              setRectangles((prevRectangles) => [...prevRectangles, data]);
            }
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
  }, [ws]);

  const connectWebSocket = () => {
    if (ws) {
      ws.close();
    }
    setWs(new WebSocket("ws://localhost:3131"));
  };

  const incrementClickCount = () => {
    setClickCount(clickCount + 1);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

useEffect(() => {
    const handleMousePos = (event) => {
      const roundedX = Math.round(event.clientX);
      const roundedY = Math.round(event.clientY);
      console.log(`Rounded Coordinates: x=${roundedX}, y=${roundedY}`);
      setMousePosition({
        x: roundedX,
        y: roundedY,
      });
    };

    window.addEventListener("mousemove", handleMousePos);

    return () => {
      window.removeEventListener("mousemove", handleMousePos);
    };
  }, []);

  const showRoutes = () => {
    console.log("Routes: /home, /admin, /admin/users, /admin/users/:id");
  };

  const reconnect = () => {
    connectWebSocket();
  };

  return (
    <div className="App">
      <h2>Small Playground For WebSocket-Applications</h2>
      <div className="card">
        <h3>WebSocket Client</h3>
        <p>Press buttons below to connect and disconnect from WebSocket</p>
        <button onClick={() => ws ? ws.close() : setWs(new WebSocket("ws://localhost:3131"))}>
          {ws ? "Disconnect" : "Connect"}
        </button>
        <p>Connection: <span style={{ color: "orange" }}>{connectionStatus}</span></p>
        <p>Client: <span style={{ color: "orange" }}>{window.location.hostname}</span></p>
        <p>Server: <span style={{ color: "orange" }}>{ ws ? ws.url.slice(5) : "" }</span></p>
        <button onClick={reconnect}>Reconnect</button>
        <p>Enter a message below and choose a color.</p>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          ref={inputRef}
        />
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color}
              style={{
                backgroundColor: color,
                border: selectedColor === color ? "3px solid black" : "1px solid gray",
                margin: "0.2em",
                padding: "0.5em",
                cursor: "pointer",
              }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <Canvas
          ws={ws}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          incrementClickCount={incrementClickCount}
          rectangles={rectangles}
          setRectangles={setRectangles}
        />
      </div>
      <div className="card">
        <h4>Messages from Server on ws://localhost:3131</h4>
        <ul id="msg-box">
          {messages.map((msg, index) => (
            <li key={index}>
              <span style={{ color: "black" }}>
                {msg.message} (x: {msg.position.x}, y: {msg.position.y}) - Color: {msg.color} - Timestamp: {msg.timestamp} - Click Count: {msg.clickCount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;