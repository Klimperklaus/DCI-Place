import { useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";

const Canvas = ({ ws, selectedColor, incrementClickCount, rectangles, setRectangles }) => {
  const [canSetPixel, setCanSetPixel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSetPixel(true);
    }, 100); // Throttling durch Setzen eines Timers

    return () => clearTimeout(timer);
  }, [canSetPixel]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Message received in Canvas:", data); // Log empfangene Nachrichten
          if (data.type === "initialData") {
            setRectangles(data.data);
          } else {
            setRectangles((prevRectangles) => [...prevRectangles, data]);
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };
    }
  }, [ws]);

  const handleCanvasClick = (e) => {
    if (!canSetPixel) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const newRectangle = {
      position: {
        x: Math.round(pointerPosition.x),
        y: Math.round(pointerPosition.y),
      },
      color: selectedColor || "black", // Standardfarbe ist Schwarz
      timestamp: new Date().toLocaleString(),
    };

    setRectangles([...rectangles, newRectangle]);
    setCanSetPixel(false);

    // Überprüfen, ob die WebSocket-Verbindung vorhanden ist
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(newRectangle));
      incrementClickCount();
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  return (
    <div>
      <Stage
        width={480}
        height={320}
        onClick={handleCanvasClick}
        style={{ border: "5px solid black", cursor: "crosshair" }}
      >
        <Layer>
          {rectangles.map((rect, index) => (
            rect.position && typeof rect.position.x === 'number' && typeof rect.position.y === 'number' ? (
              <Rect
                key={index}
                x={rect.position.x}
                y={rect.position.y}
                width={1}
                height={1}
                fill={rect.color}
              />
            ) : null
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;