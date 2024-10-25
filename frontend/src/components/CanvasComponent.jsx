import { useState, useMemo } from "react";
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
        localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
        return updatedRectangles;
      });
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "canvasUpdate", data: newRect }));
      } else {
        console.error("WebSocket connection is not open.");
      }
    }
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
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
