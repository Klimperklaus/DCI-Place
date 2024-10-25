import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const CanvasComponent = ({ selectedColor, ws, setCoordinates, rectangles, setRectangles }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasWidth = 768;
  const canvasHeight = 512;
  const cellSize = 2;

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    setHoveredCell({ x: cellX, y: cellY });
    setCoordinates({ x: cellX, y: cellY });
  };

  const handleClick = (e) => {
    if (e.evt.button === 2) e.evt.preventDefault();
    else if (e.evt.button === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const newRect = {
        x: cellX * cellSize,
        y: cellY * cellSize,
        width: cellSize,
        height: cellSize,
        fill: selectedColor,
      };
      setRectangles((prevRectangles) => {
        const updatedRectangles = [...prevRectangles, newRect];
        localStorage.setItem("canvasData", JSON.stringify(updatedRectangles)); // Aktualisieren der Daten im lokalen Speicher
        return updatedRectangles;
      });

      // Überprüfen, ob die WebSocket-Verbindung vorhanden ist
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "canvasUpdate", data: newRect }));
      } else {
        console.error("WebSocket connection is not open.");
      }
    }
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault(); // Verhindert das Standard-Kontextmenü
  };

  const renderedRectangles = useMemo(() => {
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <TransformWrapper
      defaultScale={1}
      panning={{ allowLeftClickPan: false }}
      wheel={{ smoothStep: 0.03 }}
      maxScale={50}
      doubleClick={{ disabled: true }}
    >
      <TransformComponent>
        <Stage
          style={{ imageRendering: "pixelated" }}
          width={canvasWidth}
          height={canvasHeight}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          pixelRatio={1}
        >
          <Layer>
            {renderedRectangles}
            {hoveredCell && (
              <Rect
                x={hoveredCell.x * cellSize}
                y={hoveredCell.y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="rgba(155, 155, 155, 0.7)"
              />
            )}
          </Layer>
        </Stage>
      </TransformComponent>
    </TransformWrapper>
  );
};

CanvasComponent.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  ws: PropTypes.object,
  setCoordinates: PropTypes.func.isRequired,
  rectangles: PropTypes.array.isRequired,
  setRectangles: PropTypes.func.isRequired,
};

export default CanvasComponent;

/*
import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useFetchCanvasData from "../hooks/useFetchCanvasData";

const CanvasComponent = ({ selectedColor, ws, setCoordinates }) => {
  // TO-DO: useFetchCanvasData-Hook nicht hier verwenden sondern erst cache überprüfen!!!
  // und sicherstellen, dass die Daten nur einmal geladen werden. Außerdem sollte noch 
  // sichergestllt werden, dass nur x,y und farbe im cache gespeichert werden und nicht die gesamten
  // Daten. Der cache wird im modul cache.js verwaltet. MUSS NOCH IMPLEMENTIERT WERDEN!!!
  // Die Abfrage geschieht über die Funktion fetchCanvasData in Canvas.jsx. MUSS NOCH IMPLEMENTIERT WERDEN!!!
  const { rectangles, setRectangles } = useFetchCanvasData();
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasWidth = 768;
  const canvasHeight = 512;
  const cellSize = 2;

  //TO-DO: Die useEffect Funktion so anpassen, dass die Daten nur einmal geladen werden
  // und nur die x,y und farbe Werte im cache gespeichert werden.
  // Sicherstellen, dass die ws verbindung beim betreten des Canvas aufgebaut wird und
  // beim verlassen des Canvas geschlossen wird.
  // Dazu noch WebSocketClient.jsx anpassen und hier importieren. MUSS NOCH IMPLEMENTIERT WERDEN!!!
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Message received in CanvasComponent:", data);
          if (data.type === "initialData") {
            setRectangles(data.data);
          } else {
            setRectangles((prevRectangles) => [...prevRectangles, data]);
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
        alert("WebSocket-Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        alert("WebSocket-Verbindung geschlossen.");
      };
    }
  }, [ws, setRectangles]);

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    setHoveredCell({ x: cellX, y: cellY });
    setCoordinates({ x: cellX, y: cellY });
  };

  const handleClick = (e) => {
    if (e.evt.button === 2) e.evt.preventDefault();
    else if (e.evt.button === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const newRect = {
        x: cellX * cellSize,
        y: cellY * cellSize,
        width: cellSize,
        height: cellSize,
        fill: selectedColor,
      };
      setRectangles([...rectangles, newRect]);

      // Überprüfen, ob die WebSocket-Verbindung vorhanden ist
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(newRect));
      } else {
        console.error("WebSocket connection is not open.");
      }
    }
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault(); // Verhindert das Standard-Kontextmenü
  };

  const renderedRectangles = useMemo(() => {
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <TransformWrapper
      defaultScale={1}
      panning={{ allowLeftClickPan: false }}
      wheel={{ smoothStep: 0.03 }}
      maxScale={50}
      doubleClick={{ disabled: true }}
    >
      <TransformComponent>
        <Stage
          style={{ imageRendering: "pixelated" }}
          width={canvasWidth}
          height={canvasHeight}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          pixelRatio={1}
        >
          <Layer>
            {renderedRectangles}
            {hoveredCell && (
              <Rect
                x={hoveredCell.x * cellSize}
                y={hoveredCell.y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="rgba(155, 155, 155, 0.7)"
              />
            )}
          </Layer>
        </Stage>
      </TransformComponent>
    </TransformWrapper>
  );
};

CanvasComponent.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  ws: PropTypes.object,
  setCoordinates: PropTypes.func.isRequired,
};

export default CanvasComponent;
*/