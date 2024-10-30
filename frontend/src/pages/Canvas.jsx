import { useEffect, useState, useMemo } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";
import { Stage, Layer, Rect } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState("");
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    const usernameFromCookie = Cookies.get("username"); // Assuming the username is stored in a cookie
    if (usernameFromCookie) {
      setUsername(usernameFromCookie);
    }
    if (token) {
      setIsAuthenticated(true);
      const cachedCanvasData = localStorage.getItem("canvasData");
      if (cachedCanvasData) {
        try {
          const parsedData = JSON.parse(cachedCanvasData);
          if (Array.isArray(parsedData)) {
            setRectangles(parsedData);
          } else {
            console.warn("Cached data is not an array");
          }
        } catch (error) {
          console.error("Error parsing cached data:", error);
          localStorage.removeItem("canvasData");
        }
      } else {
        fetchDbData();
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [fetchDbData, setRectangles, isAuthenticated]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.type === "canvasUpdate") {
            setRectangles((prevRectangles) => {
              const updatedRectangles = [...prevRectangles, data.data];
              localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
              return updatedRectangles;
            });
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "canvasData") {
        const cachedCanvasData = localStorage.getItem("canvasData");
        if (cachedCanvasData) {
          try {
            const parsedData = JSON.parse(cachedCanvasData);
            if (Array.isArray(parsedData)) {
              setRectangles(parsedData);
            } else {
              console.warn("Cached data is not an array");
            }
          } catch (error) {
            console.error("Error parsing cached data:", error);
            localStorage.removeItem("canvasData");
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setRectangles]);

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const cellX = Math.floor(x / 2);
    const cellY = Math.floor(y / 2);
    setCoordinates({ x: cellX, y: cellY });
  };

  const handleClick = (e) => {
    if (e.evt.button === 2) e.evt.preventDefault();
    else if (e.evt.button === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const cellX = Math.floor(x / 2);
      const cellY = Math.floor(y / 2);
      const newRect = {
        _id: `${cellX}_${cellY}`,
        x: cellX * 2,
        y: cellY * 2,
        width: 2,
        height: 2,
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
    console.log("rectangles:", JSON.stringify(rectangles, null, 2));
    console.log("Rendered Rectangles:", JSON.stringify(rectangles, null, 2));
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <div id="canvas-colorpicker-container-bckgr-img" style={{ borderColor: selectedColor, borderWidth: '10px', borderStyle: 'solid' }}>
      <div id="canvas-colorpicker-container">
        {isAuthenticated ? (
          <>
            <ColorPicker setSelectedColor={setSelectedColor} />
            <WebSocketClient
              setWs={setWs}
              setConnectionStatus={setConnectionStatus}
              setMessages={setMessages}
              setError={setError}
            />
            <div id="canvas-container">
              <TransformWrapper
                defaultScale={1}
                panning={{ allowLeftClickPan: false, velocityDisabled: true }}
                wheel={{ smoothStep: 0.03 }}
                maxScale={50}
                doubleClick={{ disabled: true }}
                centerOnInit={true}
              >
                <TransformComponent>
                  <Stage
                    id="canvas-stage"
                    style={{ imageRendering: "pixelated" }}
                    width={1024}
                    height={640}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    pixelRatio={1}
                  >
                    <Layer id="canvas-layer">
                      {renderedRectangles}
                      {coordinates && (
                        <Rect
                          x={coordinates.x * 2}
                          y={coordinates.y * 2}
                          width={2}
                          height={2}
                          fill="rgba(155, 155, 155, 0.7)"
                        />
                      )}
                    </Layer>
                  </Stage>
                </TransformComponent>
              </TransformWrapper>
            </div>
            <span id="coordinates">
              <Coordinates coordinates={coordinates} />
              <span id="username-canvas">Benutzer: {username}</span>
            </span>
          </>
        ) : (
          <ReadOnlyCanvas rectangles={rectangles} />
        )}
      </div>
    </div>
  );
};

export default Canvas;