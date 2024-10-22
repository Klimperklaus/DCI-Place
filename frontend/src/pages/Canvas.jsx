import { useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import WebSocketClient from "../components/WebSocketClient.jsx";

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
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  return (
    <div className="canvas-container">
      <ColorPicker setSelectedColor={setSelectedColor} />
      <Coordinates coordinates={coordinates} />
      <WebSocketClient
        setWs={setWs}
        setConnectionStatus={setConnectionStatus}
        setMessages={setMessages}
        setError={setError}
      />
      <div className="stage-container">
        <CanvasComponent
          selectedColor={selectedColor}
          ws={ws}
          setCoordinates={setCoordinates}
        />
      </div>
    </div>
  );
};

export default Canvas;