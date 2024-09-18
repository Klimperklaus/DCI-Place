import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { ChromePicker } from 'react-color';
import "../styles/Canvas.scss"

const App = () => {
  const [selectedColor, setSelectedColor] = useState('#FF5733');
  const [rectangles, setRectangles] = useState([]);
  const [canSetPixel, setCanSetPixel] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSetPixel(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [canSetPixel]);

  const getCrosshairCursor = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
      <line x1="0" y1="50" x2="49.5" y2="50" stroke="${selectedColor}" strokeWidth="2" />
      <line x1="50.5" y1="50" x2="100" y2="50" stroke="${selectedColor}" strokeWidth="2" />
      <line x1="50" y1="0" x2="50" y2="49.5" stroke="${selectedColor}" strokeWidth="2" />
      <line x1="50" y1="50.5" x2="50" y2="100" stroke="${selectedColor}" strokeWidth="2" />
      <rect x="49" y="49" width="3" height="3" fill="transparent" />
      </svg>
    `;
    return `url('data:image/svg+xml;base64,${btoa(svg)}') 50 50, auto`;
  };

  const handleCanvasClick = (e) => {
    if (!canSetPixel) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    setRectangles([
      ...rectangles,
      { x: pointerPosition.x -5 , y: pointerPosition.y -5 , color: selectedColor },
    ]);
    console.log(`Rectangle added at (${pointerPosition.x}, ${pointerPosition.y}) with color ${selectedColor}`);

    setCanSetPixel(false);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    console.log(`Color selected: ${color.hex}`);
  };

  return (
    <div className="wrapper">
      {
      /** 
       * @TODO convert to scss
       */
      }
      <div className="test"> 
        <div className="test2">
          {canSetPixel ? 'You can set a pixel' : 'Please wait...'}
        </div>
        <div
          className="test3"
          style={{ backgroundColor: selectedColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker && (
          <ChromePicker
            color={selectedColor}
            onChange={handleColorChange}
          />
        )}
      </div>
      <div className="test4">
        <Stage
          // width={window.innerWidth}
          // height={window.innerHeight}
          onClick={handleCanvasClick}
          style={{ border: '5px solid black', cursor: getCrosshairCursor() }}
        >
          <Layer>
            {rectangles.map((rect, index) => (
              <Rect
                key={index}
                x={rect.x}
                y={rect.y}
                width={1}
                height={1}
                fill={rect.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;