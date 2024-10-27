import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const WebSocketClient = ({
  setWs,
  setConnectionStatus,
  setMessages,
  setError,
}) => {
  const [localWs, setLocalWs] = useState(null);

  useEffect(() => {
    if (localWs) {
      localWs.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };

      localWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.error) {
            console.error("Server error: ", data.error);
            setError(data.error);
          } else {
            setMessages((prevMessages) => [...prevMessages, data]);
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };

      localWs.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      localWs.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [localWs, setConnectionStatus, setError, setMessages]);

  const connectWebSocket = () => {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }
    if (localWs) {
      localWs.close();
      setLocalWs(null);
      setWs(null);
      console.log('WebSocket connection closed');
    } else {
      console.log('Initiating WebSocket connection'); // Log hinzugefügt
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
      newWs.onopen = () => {
        console.log('WebSocket connection established'); // Log hinzugefügt
        setWs(newWs);
        setLocalWs(newWs);
      };
      newWs.onerror = (error) => {
        console.error('WebSocket connection error:', error);
      };
      // Hinzufügen von onmessage, onclose und onerror
      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);
      };
      newWs.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
  };

  return (
    <button onClick={connectWebSocket}>
      {localWs ? "Disconnect WebSocket" : "Connect WebSocket"}
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
