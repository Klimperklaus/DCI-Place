import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const WebSocketClient = ({
  setWs, // Function to set the WebSocket instance
  setConnectionStatus, // Function to update connection status
  setMessages, // Function to store received messages
  setError, // Function to handle errors
}) => {
  const [localWs, setLocalWs] = useState(null); // Local state to manage WebSocket instance

  // Effect hook to handle WebSocket events when localWs changes
  useEffect(() => {
    if (localWs) {
      localWs.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus("Connected"); // Update connection status to "Connected"
      };
      localWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.error) {
            console.error("Server error: ", data.error);
            setError(data.error); // Set the error message
          } else {
            setMessages((prevMessages) => [...prevMessages, data]); // Append new messages to the existing list
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
        setConnectionStatus("Disconnected"); // Update connection status to "Disconnected"
      };
    }
  }, [localWs, setConnectionStatus, setError, setMessages]);

  // Function to connect or disconnect the WebSocket
  const connectWebSocket = () => {
    const token = Cookies.get("token_js"); // Retrieve token from cookies
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }
    if (localWs) {
      localWs.close(); // Close the existing WebSocket connection
      setLocalWs(null); // Reset local state
      setWs(null); // Set the parent component's WebSocket instance to null
      console.log("WebSocket connection closed");
    } else {
      const newWs = new WebSocket(`ws://localhost:3131?token=${token}`); // Create a new WebSocket with token
      setLocalWs(newWs); // Set the local state to the newly created WebSocket
      setWs(newWs); // Pass the new WebSocket instance to the parent component
      console.log("WebSocket connection initiated");
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
