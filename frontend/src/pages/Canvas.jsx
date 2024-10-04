import { useState, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/Canvas.scss"; 

const Canvas = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showGrid, setShowGrid] = useState(false); // Zustand für das Raster

  const canvasWidth = 800;
  const canvasHeight = 600;
  const cellSize = 10;

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    setHoveredCell({ x: cellX, y: cellY });
  };

  const handleClick = (e) => {
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
        <button id="grid-switch-button" onClick={() => setShowGrid(!showGrid)}>
          {showGrid ? "Raster ausblenden" : "Raster anzeigen"}
        </button>
      </div>
      <div className="stage-container">
        <TransformWrapper>
          <TransformComponent>
            <Stage
              width={canvasWidth}
              height={canvasHeight}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
            >
{/* Layer ist eine Gruppe von Knoten, die zusammen gerendert werden. Überlegen wie wir auf arrays verzichten können */}
              <Layer>
                {showGrid &&
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
                {renderedRectangles}
                {hoveredCell && (
                  <Rect
                    x={hoveredCell.x * cellSize}
                    y={hoveredCell.y * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="rgba(211, 211, 211, 0.5)" // Hellgrau transparent
                  />
                )}
              </Layer>
            </Stage>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Canvas;
/*
import React, { useState, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";


const Canvas = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [scale, setScale] = useState(1);
  const [hoveredCell, setHoveredCell] = useState(null);

  const canvasWidth = 400;
  const canvasHeight = 250;
  const cellSize = 1;

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const newScale = scale + e.evt.deltaY * -0.01;
    setScale(Math.min(Math.max(1, newScale), 30));
  };

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / (cellSize * scale));
    const cellY = Math.floor(y / (cellSize * scale));
    setHoveredCell({ x: cellX, y: cellY });
  };

  const handleClick = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / (cellSize * scale));
    const cellY = Math.floor(y / (cellSize * scale));
    const newRect = {
      x: cellX * cellSize,
      y: cellY * cellSize,
      width: cellSize,
      height: cellSize,
      fill: selectedColor,
    };
    setRectangles([...rectangles, newRect]);
  };

  const renderedRectangles = useMemo(() => {
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "10vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          right: 0,
          position: "fixed",
          backgroundColor: "rgb(40, 41, 41)",
        }}
      >
        <h1 style={{ color: "white", paddingBottom: "2rem" }}>COLORS</h1>
        <ul
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            listStyle: "none",
            gap: "1rem",
          }}
        >
          {["yellow", "red", "green", "purple"].map((color) => (
            <li
              key={color}
              style={{
                background: color,
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
              }}
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
      <div
        style={{
          width: "90vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stage
          width={canvasWidth * scale}
          height={canvasHeight * scale}
          scaleX={scale}
          scaleY={scale}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <Layer>
            {renderedRectangles}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
*/
/*
import { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";


// Rechteck mit der Zeichenfläche erstellen. Als Props werden die Farbe, die Zelle über die der pointer steht, die Breite/Höhe des Rechtecks übergeben.
  const Canvas = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [scale, setScale] = useState(1);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [canSetPixel, setCanSetPixel] = useState(true);

  const canvasWidth = 400;
  const canvasHeight = 250;
  // mit cellSize wird die Größe der Unterteilung definiert- in diesem Fall 10 wäre eine Überlegung, 4 oder 8 zu nehmen fürs fp
  // cellSize wird später mit scale multipliziert, um die Größe der Zelle zu vergrößern oder zu verkleinern
  const cellSize = 2;

  // Zoomen der Zeichenfläche
  const handleWheel = (e) => {
    e.evt.preventDefault();
    //deltaY für die Richtung des Scrollens, mit -0.01 multipliziert, um die Geschwindigkeit des Zoomens zu ändern
    // scale startet bei 1 unfd wird mit jedem Scrollen verändert
    const newScale = scale + e.evt.deltaY * -0.01;
    //Begrezung der Skalierung auf 1 bis 30
    //Math.min und Math.max, um die Skalierung zu begrenzen
    setScale(Math.min(Math.max(1, newScale), 30));
    //const newScale = 1;
    //setScale(newScale);
  };

  // Bewegung des Mauszeigers löst Funktion aus, um die Zelle zu finden, über die der Mauszeiger steht
  // mit setHoveredCell werden die Werte von x und y gesetzt. Dies geschieht unter Einberechnung der Mauszeigerposition und der Zellengröße!
  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / (cellSize * scale));
    const cellY = Math.floor(y / (cellSize * scale));
    setHoveredCell({ x: cellX, y: cellY });
  };

  // Folgendesa bei click: Mauszeigerposition wird ermittelt, Zelle wird gefunden, über die der Mauszeiger steht
  const handleClick = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    // x und y werden durch cellSize und scale geteilt, um die Zelle zu finden, über die der Mauszeiger steht
    // wichtig: Math.floor, um die Zelle zu finden, über die der Mauszeiger steht, sonst liegen die Zellen nicht auf der Linie und wieder übereinander!!!!!!!!
    // Im Unterschied zu parsInt wird mit Math.floor immer abgerundet, parsInt rundet auf oder ab. Mit parsInt keine PERSISENTEN WERTE!!!!!!! :)
    const cellX = Math.floor(x / (cellSize * scale));
    const cellY = Math.floor(y / (cellSize * scale));
    // neues Rechteck wird erstellt, mit den Werten x, y, width, height und fill(gewählte Farbe)
    // mit den abgerundeten Werten von cellX und cellY erfolgt die Auswahl EXAKT EINER ZELLE und mit cellSize wurde die Größe der Zelle festgelegt
    const newRect = {
      x: cellX * cellSize,
      y: cellY * cellSize,
      width: cellSize,
      height: cellSize,
      fill: selectedColor,
    };
    // neues Rechteck wird in das Array rectangles hinzugefügt
    setRectangles([...rectangles, newRect]);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "10vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          right: 0,
          position: "fixed",
          backgroundColor: "rgb(40, 41, 41)",
        }}
      >
        <h1 style={{ color: "white", paddingBottom: "2rem" }}>COLORS</h1>
        <ul
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            listStyle: "none",
            gap: "1rem",
          }}
        >
          {["yellow", "red", "green", "purple"].map((color) => (
            <li
              key={color}
              style={{
                background: color,
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
              }}
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
      <div
        style={{
          width: "90vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stage
          width={canvasWidth * scale}
          height={canvasHeight * scale}
          scaleX={scale}
          scaleY={scale}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <Layer>
            {Array.from({ length: canvasWidth / cellSize }, (_, rowIndex) =>
              Array.from({ length: canvasHeight / cellSize }, (_, colIndex) => (
                <Rect
                  key={`${rowIndex}-${colIndex}`}
                  x={rowIndex * cellSize}
                  y={colIndex * cellSize}
                  width={cellSize}
                  height={cellSize}
                  stroke={null}
                  strokeWidth={0.2}
                  fill={
                    hoveredCell &&
                    hoveredCell.x === rowIndex &&
                    hoveredCell.y === colIndex
                      ? "lightgray"
                      : "white"
                  }
                />
              ))
            )}
            {rectangles.map((rect, index) => (
              <Rect key={index} {...rect} />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;

/*
React-Konva ersetzt alle Funktionen von CanvasFunc mit leichter zu verwendenden Funktionen, die auf React-Komponenten basieren.
Ich weiß, dass du lieber alles selber machen möchtest aber ich sehe die Notwendigkeit auf sinnvolle und verstzändliche Bibliotheken zurückzugreifen um
überhaupt alles fertig zu bekommen :)
Alle Änderungen im Detail:
- Berechnung der Zellenpositionen und des Mauszeigers in der Zeichenfläche mit nach unter gerundeten Werten, um die Zellen exakt zu treffen
- Zoomen der Zeichenfläche mit dem Mausrad im Faktor 0.01 in einem Bereich von 1 bis 30fach
- Hinzufügen von Rechtecken in die Zeichenfläche, die exakt eine Zelle treffen und die Größe der Zelle durch den Zoomfaktor anpassen
*/

