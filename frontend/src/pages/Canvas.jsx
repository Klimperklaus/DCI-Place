import { useState, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/Canvas.scss"; 

const Canvas = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showGrid, setShowGrid] = useState(false); // Zustand für das Raster

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
    if (e.evt.button === 2) e.evt.preventDefault;
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

  // nur Komponenten, die sich ändern, werden neu gerendert. useMemo() kommt von react-konva und ist eine Hook, der Werte zwischenspeichert(also ein cached Wert)
  const renderedRectangles = useMemo(() => {
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <div className="canvas-container">
      <div className="color-picker">
        <h1>COLORS</h1>
        <ul>
          {["yellow", "red", "green", "purple"].map((color) => (
            <li
              key={color}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1.0)";
              }}
            ></li>
          ))}
        </ul>
      </div>
      <div className="canvas-border-container">
      <div className="stage-container">
        <TransformWrapper
          defaultScale={1}
          panning={{ allowLeftClickPan: false }}
        >
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
                    fill="rgba(211, 211, 211, 0.5)" // noch das crosshair und selectedColor mit opacity einfügen !!!
                  />
                )}
              </Layer>
              </Stage>
             </TransformComponent>
        </TransformWrapper>
        </div>
        </div>
    </div>
  );
};

export default Canvas;


/*
                <Layer>
      {/*         {showGrid &&
                  Array.from({ length: canvasWidth / cellSize }, (_, rowIndex) =>
                    Array.from({ length: canvasHeight / cellSize }, (_, colIndex) => (
                      <Rect
                        key={`${rowIndex}-${colIndex}`}
                        x={rowIndex * cellSize}
                        y={colIndex * cellSize}
                        width={cellSize}
                        height={cellSize}
                        stroke="black"
                        strokeWidth={0.2}
                        fill="transparent"
                      />
                    ))
                  )}  
*/
