import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const WebSocketClient = ({
  setWs,
  setConnectionStatus,
  setMessages,
  setError,
}) => {
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
    const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }

    if (ws) {
      ws.close();
      setLocalWs(null);
      setWs(null);
    } else {
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
      setLocalWs(newWs);
      setWs(newWs);
    }
  };

  return (
    <button onClick={connectWebSocket}>
      {ws ? "Disconnect WebSocket" : "Connect WebSocket"}
    </button>
  );
};

WebSocketClient.propTypes = {
  setWs: PropTypes.func.isRequired,
  setConnectionStatus: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default WebSocketClient;