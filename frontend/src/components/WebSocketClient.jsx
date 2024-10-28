import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const WebSocketClient = ({
  setWs,
  setConnectionStatus,
  setMessages,
  setError,
}) => {
  const [ws, setLocalWs] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }

    const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
    setLocalWs(newWs);
    setWs(newWs);

    newWs.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("Connected");
    };

    newWs.onmessage = (event) => {
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

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newWs.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("Disconnected");
    };

    return () => {
      newWs.close();
      setLocalWs(null);
      setWs(null);
    };
  }, [setWs, setConnectionStatus, setMessages, setError]);

  return null;
};

WebSocketClient.propTypes = {
  setWs: PropTypes.func.isRequired,
  setConnectionStatus: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default WebSocketClient;