import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/**
 * CanvasComponent is a React component that renders an interactive canvas
 * where users can draw rectangles by clicking on the canvas. The canvas
 * supports zooming and panning.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.selectedColor - The color to be used for drawing rectangles.
 *
 * @returns {JSX.Element} The rendered CanvasComponent.
 */

const CanvasComponent = ({ selectedColor }) => {
  const [rectangles, setRectangles] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasWidth = 768;
  const canvasHeight = 512;
  const cellSize = 2;

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    setHoveredCell({ x: cellX, y: cellY });
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
    <TransformWrapper defaultScale={1} panning={{ allowLeftClickPan: false }}>
      <TransformComponent>
        <Stage
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
                fill="rgba(211, 211, 211, 0.5)"
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
};

export default CanvasComponent;
