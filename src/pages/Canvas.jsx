import React, { useState } from "react";

function Canvas() {
  // vllt in data auslagern
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

  const [color, setColor] = useState("#ff4500");
  const [canvas, setCanvas] = useState(
    Array(140).fill(Array(250).fill("#ffffff")) // Größe Canvas festlegen
  ); 

  const handleCanvasClick = (row, col) => {
    const updatedCanvas = canvas.map((currentRow, rowIndex) => {
      if (rowIndex === row) {
        return currentRow.map((currentCol, colIndex) => {
          if (colIndex === col) {
            return color;
          }
          return currentCol;
        });
      }
      return currentRow;
    });
    setCanvas(updatedCanvas);
  };

  const handleButtonClick = (selectedColor) => {
    setColor(selectedColor);
  };

  return ( 
      <div>
        <div id="canvas">
          {canvas.map((row, rowIndex) => (
            <div key={rowIndex} className="canvas-row">
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="canvas-cell"
                  style={{ backgroundColor: col }}
                  onClick={() => handleCanvasClick(rowIndex, colIndex)}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div id="buttonwrap">
          {colors.map((color, index) => (
            <button
              id="colorButton"
              key={index}
              style={{ backgroundColor: color }}
              onClick={() => handleButtonClick(color)}
            ></button>
          ))}
        </div>
      </div> 
  );
}

export default Canvas;