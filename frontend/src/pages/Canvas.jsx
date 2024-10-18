import { useState } from "react";
import "../styles/Canvas.scss"; 
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent"; // Importieren Sie die CanvasComponent

/**
 * Canvas component that includes a color picker and a canvas for drawing.
 *
 * @component
 * @returns {JSX.Element} The rendered Canvas component.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.selectedColor - The currently selected color for drawing.
 * @param {function} props.setSelectedColor - Function to update the selected color.
 */

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");

  return (
    <div className="canvas-container">
      <ColorPicker setSelectedColor={setSelectedColor} />
      <div className="stage-container">
        <CanvasComponent selectedColor={selectedColor} />
      </div>
    </div>
  );
};


export default Canvas;