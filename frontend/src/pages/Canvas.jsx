import { useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import colors from "../components/colors";
import Cookies from "js-cookie";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [rectangles, setRectangles] = useState([]);
  const [canSetPixel, setCanSetPixel] = useState(true);
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSetPixel(true);
    }, 100); // Throttling durch Setzen eines Timers

    return () => clearTimeout(timer);
  }, [canSetPixel]);

  const handleCanvasClick = (e) => {
    if (!canSetPixel) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const newRectangle = {
      position: {
        x: Math.round(pointerPosition.x),
        y: Math.round(pointerPosition.y),
      },
      color: selectedColor,
      timestamp: new Date().toLocaleString(),
    };

    setRectangles([...rectangles, newRectangle]);
    setCanSetPixel(false);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(newRectangle));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  const connectWebSocket = () => {
    if (ws) {
      console.log("WebSocket connection already exists.");
      return;
    }

    const token = Cookies.get("token");

    if (!token) {
      console.error("No token available for WebSocket connection.");
      return;
    }

    console.log("Token found:", token); // Debugging-Ausgabe

    const socket = new WebSocket(`ws://localhost:3131?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("Connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error("Server error: ", data.error);
        } else {
          console.log("Message from server: ", data);
          if (data.position && data.color) {
            setRectangles((prevRectangles) => [...prevRectangles, data]);
          }
        }
      } catch (error) {
        console.error("Error parsing message from server: ", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("Disconnected");
      setWs(null); // Reset WebSocket state
    };

    setWs(socket);
  };

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div className="flex">
      <div className="w-1/4 p-1 bg-gray-200">
        <div className="text-center mb-2">
          {canSetPixel ? "You can set a pixel" : "Please wait..."}
        </div>
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-2 h-2 m-1 cursor-pointer ${
              selectedColor === color ? "border-l-2" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setSelectedColor(color);
              console.log(`Color selected: ${color}`);
            }}
          />
        ))}
      </div>
      <div className="w-3/4">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onClick={handleCanvasClick}
          style={{ border: "5px solid black", cursor: `crosshair` }}
        >
          <Layer>
            {rectangles.map((rect, index) => (
              <Rect
                key={index}
                x={rect.position.x}
                y={rect.position.y}
                width={1}
                height={1}
                fill={rect.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;