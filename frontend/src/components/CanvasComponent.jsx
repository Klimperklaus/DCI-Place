import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useFetchCanvasData from "../hooks/useFetchCanvasData";

/**
 * CanvasComponent is a React component that renders an interactive canvas
 * where users can draw rectangles by clicking on the canvas. The canvas
 * supports zooming and panning.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.selectedColor - The color to be used for drawing rectangles.
 * @param {Object} props.ws - The WebSocket connection.
 * @param {function} props.setCoordinates - Function to update the coordinates.
 *
 * @returns {JSX.Element} The rendered CanvasComponent.
 */

const CanvasComponent = ({ selectedColor, ws, setCoordinates }) => {
  const { rectangles, setRectangles } = useFetchCanvasData();
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasWidth = 768;
  const canvasHeight = 512;
  const cellSize = 2;

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