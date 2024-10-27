
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
        console.error("WebSocket error: ", error);
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
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
      setLocalWs(newWs);
      setWs(newWs);
      console.log('WebSocket connection initiated');
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
