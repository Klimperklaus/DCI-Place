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
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);    // und hier wird die Nachricht vom Server empfangen
          // ABER WAS LÄUFT HIER SCHIEF? data ist undefined, wird aber in der canvas Komponente korrekt mit den Daten von newRect befüllt
          // Also: server bekommt daten, ws verbindung ist offen, aber hier wird data nicht korrekt empfangen und verarbeitet
          // parsen bedeutet, dass die Daten in ein JSON Objekt umgewandelt werden, also sollte data hier ein JSON Objekt sein
          // Frage ist, ob das stringifiizieren vorher korrekt war, oder ob das parsen hier nicht korrekt ist
          // Warum überhaupt zuerst stringifiizieren und dann parsen? Warum nicht gleich ein JSON Objekt senden?
          
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
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected");
      };
    }
  }, [ws, setConnectionStatus, setError, setMessages]);

  const connectWebSocket = () => {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }
    if (ws) {
      ws.close();
      setLocalWs(null);
      setWs(null);
      console.log('WebSocket connection closed');
    } else {
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`);
      newWs.onopen = () => {
        console.log('WebSocket connection established');
        setWs(newWs);
        setLocalWs(newWs);
      };
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