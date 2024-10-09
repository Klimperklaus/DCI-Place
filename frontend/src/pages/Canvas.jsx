import React, { useState, useEffect } from "react";

function Canvas() {
  // Farben, die zur Auswahl stehen
  const colors = [
    "#ff4500",
    "#ffa800",
    "#ffd635",
    "#00a368",
    "#be0039",
    "#ff3881",
    "#6d001a",
    "#fff8b8",
    "#7eed56",
    "#2450a4",
    "#3690ea",
    "#51e9f4",
    "#00756f",
    "#009eaa",
    "#00ccc0",
    "#94b3ff",
    "#811e9f",
    "#b44ac0",
    "#ff99aa",
    "#9c6926",
    "#493ac1",
    "#6a5cff",
    "#e4abff",
    "#de107f",
    "#ffffff",
    "#d4d7d9",
    "#898d90",
    "#000000",
    "#00cc78",
    "#6d482f",
    "#ffb470",
    "#515252",
  ];

  // Zustand für die aktuell ausgewählte Farbe
  const [color, setColor] = useState("#ff4500");

  // Zustand für das Canvas (2D Array mit Farben)
  const [canvas, setCanvas] = useState(
    Array(140).fill(Array(250).fill("#ffffff")) // 140 x 250 weißes Canvas
  );

  // Zustand für die aktuelle Cursorposition im Canvas
  const [cursorPosition, setCursorPosition] = useState({
    row: null,
    col: null,
  });

  // Zustand, ob der Cursor innerhalb des Canvas ist
  const [isCursorInCanvas, setIsCursorInCanvas] = useState(false);

  // Effekt, der den benutzerdefinierten Cursor nur innerhalb des Canvas anzeigt
  useEffect(() => {
    if (isCursorInCanvas) {
      const cursorSize = 32; // Größe des Cursors
      const halfSize = cursorSize / 2;

      // SVG für den Cursor, der eine Kreuzlinie und einen farbigen Punkt in der Mitte zeigt
      const svg = `<svg width="${cursorSize}" height="${cursorSize}" xmlns="http://www.w3.org/2000/svg">
        <line x1="${halfSize}" y1="0" x2="${halfSize}" y2="${cursorSize}" stroke="black" stroke-width="2"/>
        <line x1="0" y1="${halfSize}" x2="${cursorSize}" y2="${halfSize}" stroke="black" stroke-width="2"/>
        <circle cx="${halfSize}" cy="${halfSize}" r="${
        halfSize / 4
      }" fill="${color}" />
      </svg>`;

      // SVG in eine URL umwandeln und als Cursor verwenden
      const encodedSvg = encodeURIComponent(svg);
      document.body.style.cursor = `url('data:image/svg+xml;utf8,${encodedSvg}') ${halfSize} ${halfSize}, auto`;
    } else {
      // Standard-Cursor anzeigen, wenn der Mauszeiger außerhalb des Canvas ist
      document.body.style.cursor = "default";
    }
  }, [color, isCursorInCanvas]);

  // Funktion, um die Cursorposition im Canvas zu verfolgen
  const handleMouseMove = (row, col) => {
    setCursorPosition({ row, col });
  };

  // Funktion, um beim Klick auf das Canvas die ausgewählte Farbe zu setzen
  const handleCanvasClick = (row, col) => {
    const updatedCanvas = canvas.map((currentRow, rowIndex) => {
      if (rowIndex === row) {
        return currentRow.map((currentCol, colIndex) => {
          if (colIndex === col) {
            return color; // Setzt die aktuelle Farbe auf die angeklickte Stelle
          }
          return currentCol;
        });
      }
      return currentRow;
    });
    setCanvas(updatedCanvas); // Aktualisiert das Canvas mit der neuen Farbe
  };

  // Funktion, um die ausgewählte Farbe zu ändern
  const handleButtonClick = (selectedColor) => {
    setColor(selectedColor);
  };

  // Funktion, die ausgelöst wird, wenn die Maus in das Canvas eintritt
  const handleMouseEnterCanvas = () => {
    setIsCursorInCanvas(true); // Aktiviert den benutzerdefinierten Cursor
  };

  // Funktion, die ausgelöst wird, wenn die Maus das Canvas verlässt
  const handleMouseLeaveCanvas = () => {
    setIsCursorInCanvas(false); // Deaktiviert den benutzerdefinierten Cursor
    setCursorPosition({ row: null, col: null }); // Setzt die Cursorposition zurück
  };

  return (
    <main>
      <div>
        {/* Canvas */}
        <div
          id="canvas"
          onMouseEnter={handleMouseEnterCanvas} // Benutzerdefinierten Cursor aktivieren
          onMouseLeave={handleMouseLeaveCanvas} // Benutzerdefinierten Cursor deaktivieren
        >
          {canvas.map((row, rowIndex) => (
            <div key={rowIndex} className="canvas-row">
              {row.map((col, colIndex) => {
                const isCursorPixel =
                  cursorPosition.row === rowIndex &&
                  cursorPosition.col === colIndex; // Überprüfen, ob der Cursor über diesem Pixel ist

                return (
                  <div
                    key={colIndex}
                    className="canvas-cell"
                    style={{
                      backgroundColor: isCursorPixel ? color : col, // Zeigt die Farbe des Cursors oder die aktuelle Farbe des Pixels
                    }}
                    onClick={() => handleCanvasClick(rowIndex, colIndex)} // Klick auf das Pixel
                    onMouseMove={() => handleMouseMove(rowIndex, colIndex)} // Verfolgt die Bewegung des Cursors
                  ></div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Farbauswahl-Buttons */}
        <div id="buttonWrap">
          {colors.map((color, index) => (
            <button
              id="colorButton"
              key={index}
              style={{ backgroundColor: color }}
              onClick={() => handleButtonClick(color)} // Ändert die ausgewählte Farbe
            ></button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Canvas;
