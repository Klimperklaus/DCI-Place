import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const CanvasComponent = ({
  selectedColor,
  ws,
  setCoordinates,
  rectangles,
  setRectangles,
}) => {
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

  // Handle click events on the canvas to add new rectangles
  const handleClick = (e) => {
    // Prevent default context menu (right-click menu) if it's a right mouse button click
    if (e.evt.button === 2) e.evt.preventDefault();
    // If it's a left mouse button click, proceed to add a new rectangle
    else if (e.evt.button === 0) {
      // Get the coordinates of the pointer relative to the stage (canvas)
      const { x, y } = e.target.getStage().getPointerPosition();
      // Calculate which cell corresponds to the click position based on the cell size
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      // Define a new rectangle object with properties: x, y, width, height, and fill color
      const newRect = {
        x: cellX,
        y: cellY,
        width: cellSize,
        height: cellSize,
        fill: selectedColor,
      };
      // Update the state with the new rectangle by adding it to the previous rectangles and storing in localStorage
      setRectangles((prevRectangles) => {
        const updatedRectangles = [...prevRectangles, newRect];
        localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
        return updatedRectangles;
      });
      // If a WebSocket connection exists and is open, send the update to the server
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
    return rectangles.map((rect, index) => <Rect key={index} {...rect} />);
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
