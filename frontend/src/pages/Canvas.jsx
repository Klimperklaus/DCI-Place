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
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
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

  const handleFetchDbData = async () => {
    await fetchDbData();
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
  };

  const handleRenderLocalStorageData = () => {
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
  };

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
    return rectangles.map((rect, index) => (
      <Rect key={index} {...rect} />
    ));
  }, [rectangles]);

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <button onClick={handleFetchDbData}>Fetch Data from DB</button>
          <button onClick={handleRenderLocalStorageData}>Render Data from Local Storage</button>
          <div className="stage-container">
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
                  width={768}
                  height={512}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onContextMenu={handleContextMenu}
                  pixelRatio={1}
                >
                  <Layer>
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
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;

/*
import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
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

  const handleFetchDbData = async () => {
    await fetchDbData();
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
  };

  const handleRenderLocalStorageData = () => {
    const cachedCanvasData = localStorage.getItem("canvasData");
    if (cachedCanvasData) {
      try {
        const parsedData = JSON.parse(cachedCanvasData);
        if (Array.isArray(parsedData)) {
          setRectangles(parsedData);
          console.log("Data rendered from Local Storage");
        } else {
          console.warn("Cached data is not an array");
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        localStorage.removeItem("canvasData");
      }
    }
  };

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <button onClick={handleFetchDbData}>Fetch Data from DB||</button>
          <button onClick={handleRenderLocalStorageData}>||Render Data from Local Storage</button>
          <div className="stage-container">
            <CanvasComponent
              selectedColor={selectedColor}
              ws={ws}
              setCoordinates={setCoordinates}
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;

/*
import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      setIsAuthenticated(true);
      fetchDbData(); // Daten aus der DB abrufen und rendern
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
              const updatedRectangles = prevRectangles.map((rect) =>
                rect._id === data.data._id ? data.data : rect
              );
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

  const handleFetchDbData = async () => {
    await fetchDbData();
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
  };

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <button onClick={handleFetchDbData}>Fetch Data from DB</button>
          <div className="stage-container">
            <CanvasComponent
              selectedColor={selectedColor}
              ws={ws}
              setCoordinates={setCoordinates}
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;


/* TODO Dateien, die geändert werden müssen:
Canvas.jsx

CanvasComponent.jsx

useFetchCanvasData.js

WebSocketClient.jsx

websocketServer.js

canvasRoutes.js

canvasModel.js

database.js

userController.js

1. Canvas.jsx
Sicherstellen, dass die MongoDB-Daten beim Einloggen abgerufen und gerendert werden sowie die WebSocket-Verbindung korrekt hergestellt wird.

Änderungen:

Fehlerbehandlung beim Abrufen und Verarbeiten von Daten verbessern.

Synchronisation von localStorage und Zustand (setRectangles) sicherstellen.

WebSocket-Nachrichten korrekt verarbeiten.

2. CanvasComponent.jsx
Wir müssen die WebSocket-Nachrichten korrekt verarbeiten, um sicherzustellen, dass Live-Updates bei allen Clients erfolgen.

Änderungen:

Fehlerbehandlung beim Empfangen und Verarbeiten von WebSocket-Nachrichten verbessern.

Synchronisation der WebSocket-Updates und des Zustands (setRectangles) sicherstellen.

3. useFetchCanvasData.js
Die Funktion useFetchCanvasData muss die Canvas-Daten beim Einloggen abrufen und im Zustand sowie im localStorage speichern.

Änderungen:

Token-Verifizierung und Fehlerbehandlung verbessern.

Synchronisation von localStorage und Zustand (rectangles, dbRectangles) sicherstellen.

4. WebSocketClient.jsx
Die WebSocket-Verbindung muss korrekt hergestellt und geschlossen werden, um sicherzustellen, dass Nachrichten korrekt empfangen und verarbeitet werden.

Änderungen:

Token-Verifizierung und Fehlerbehandlung verbessern.

Sicherstellen, dass die WebSocket-Verbindung korrekt initialisiert und geschlossen wird, um Speicherlecks zu vermeiden.

Synchronisation sicherstellen (setWs, setConnectionStatus, setMessages, setError).

5. websocketServer.js
Der WebSocket-Server muss sicherstellen, dass Datenbankaktualisierungen korrekt ausgeführt werden und alle verbundenen Clients aktualisiert werden.

Änderungen:

Token-Verifizierung und Fehlerbehandlung verbessern.

Datenbankaktualisierungen und Synchronisation der verbundenen Clients sicherstellen.

Verbesserte Fehlerbehandlung bei der Verarbeitung von Nachrichten und Datenbankoperationen.

6. canvasRoutes.js
Die API-Routen müssen sicherstellen, dass Daten korrekt abgerufen und aktualisiert werden.

Änderungen:

Fehlerhafte Anfrageverarbeitung und Datenbankverbindung abfangen.

Verbesserte Fehlerbehandlung beim Abrufen und Aktualisieren von Daten.

Verbesserte Token-Überprüfung.

7. canvasModel.js
Das Datenmodell muss sicherstellen, dass alle benötigten Felder vorhanden und korrekt definiert sind.

Änderungen:

Sicherstellen, dass alle benötigten Felder (z.B. _id, position_x, position_y, color, timestamp) vorhanden und korrekt definiert sind.

Verbindungsprobleme zur MongoDB-Datenbank abfangen und handhaben.

8. database.js
Die Datenbankverbindung muss stabil bleiben und Verbindungsfehler abgefangen werden.

Änderungen:

Verbindungsprobleme zur MongoDB-Datenbank abfangen und handhaben.

Sicherstellen, dass die Verbindung zur Datenbank stabil bleibt.

Verbesserte Logs für Verbindungsstatus und Fehler ausgeben.

9. userController.js
Die Benutzerverwaltung muss sicherstellen, dass die Token-Generierung und -Verwaltung korrekt funktioniert.

Änderungen:

Sicherstellen, dass die Token-Generierung und -Verwaltung korrekt funktioniert.

import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
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
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
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
              const updatedRectangles = prevRectangles.map((rect) =>
                rect._id === data.data._id ? data.data : rect
              );
              localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
              return updatedRectangles;
            });
          }
          if (data.type === "error") {
            console.error("Server error: ", data.message);
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

  const handleFetchDbData = async () => {
    await fetchDbData();
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
  };

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <button onClick={handleFetchDbData}>Fetch Data from DB</button>
          <div className="stage-container">
            <CanvasComponent
              selectedColor={selectedColor}
              ws={ws}
              setCoordinates={setCoordinates}
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;



/*
import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
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
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
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
              const updatedRectangles = prevRectangles.map((rect) =>
                rect._id === data.data._id ? data.data : rect
              );
              localStorage.setItem("canvasData", JSON.stringify(updatedRectangles));
              return updatedRectangles;
            });
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

  const handleFetchDbData = async () => {
    await fetchDbData();
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
  };

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <Coordinates coordinates={coordinates} />
          <WebSocketClient
            setWs={setWs}
            setConnectionStatus={setConnectionStatus}
            setMessages={setMessages}
            setError={setError}
          />
          <button onClick={handleFetchDbData}>Fetch Data from DB</button>
          <div className="stage-container">
            <CanvasComponent
              selectedColor={selectedColor}
              ws={ws}
              setCoordinates={setCoordinates}
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;
*/
/*
import { useEffect, useState } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
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
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
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
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
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
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;
*/
/*
import { useEffect, useState, useCallback } from "react";
import "../styles/Canvas.scss";
import ColorPicker from "../utilities/ColorPicker";
import CanvasComponent from "../components/CanvasComponent";
import Coordinates from "../utilities/Coordinates";
import useFetchCanvasData from "../hooks/useFetchCanvasData.js";
import Cookies from "js-cookie";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import WebSocketClient from "../components/WebSocketClient";

const Canvas = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [ws, setWs] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rectangles, setRectangles, fetchDbData } = useFetchCanvasData();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (token) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
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
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
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
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setRectangles]);

  return (
    <div className="canvas-container">
      {isAuthenticated ? (
        <>
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
              rectangles={rectangles}
              setRectangles={setRectangles}
            />
          </div>
        </>
      ) : (
        <ReadOnlyCanvas rectangles={rectangles} />
      )}
    </div>
  );
};

export default Canvas;
*/