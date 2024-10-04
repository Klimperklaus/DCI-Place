import React, { useEffect, useState } from "react";
const WebSocketComponent = ({ setWs, setConnectionStatus, setMessages, setError }) => {
  const [ws, setLocalWs] = useState(null);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data); // Log empfangene Nachrichten

          if (data.error) {
            console.error("Server error: ", data.error);
            setError(data.error); // Fehlermeldung setzen
          } else {
            setMessages((prevMessages) => [...prevMessages, data]);
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
  }, [ws]);

  const connectWebSocket = () => {
    if (ws) {
      ws.close();
      setLocalWs(null);
      setWs(null);
    } else {
      const newWs = new WebSocket("ws://localhost:3131");
      setLocalWs(newWs);
      setWs(newWs);
    }
  };

  return (
    <div>
      <button onClick={connectWebSocket}>
        {ws ? "Reconnect" : "Connect"}
      </button>
    </div>
  );
};

export default WebSocketComponent;