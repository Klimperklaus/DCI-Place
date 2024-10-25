import { makeAutoObservable } from "mobx";
import Cookies from "js-cookie";

class CanvasStore {
  rectangles = [];
  ws = null;
  connectionStatus = "Disconnected";
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = Cookies.get("token_js");
    if (token) {
      this.isAuthenticated = true;
      this.fetchCanvasData();
    }
  }

  fetchCanvasData() {
    const cachedCanvasData = localStorage.getItem("canvasData");
    if (cachedCanvasData) {
      this.rectangles = JSON.parse(cachedCanvasData);
    } else {
      this.fetchDbData();
    }
  }

  async fetchDbData() {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im Cookie gefunden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/canvas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        Cookies.remove("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        this.rectangles = data;
        localStorage.setItem("canvasData", JSON.stringify(data));
      } else {
        console.error("Error fetching canvas data: ", data.msg);
      }
    } catch (error) {
      console.error("Error fetching canvas data: ", error);
    }
  }

  connectWebSocket() {
    const token = Cookies.get("token_js");
    if (!token) {
      console.error("Kein Token im Cookie gefunden.");
      return;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    } else {
      this.ws = new WebSocket(`ws://localhost:3131?token=${token}`);
      this.ws.onopen = () => {
        console.log("WebSocket connection established");
        this.connectionStatus = "Connected";
        this.ws.send(
          JSON.stringify({ type: "testMessage", message: "Hello from client" })
        );
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from WebSocket:", data);
          if (data.type === "canvasUpdate") {
            this.rectangles = data.data;
            localStorage.setItem("canvasData", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.connectionStatus = "Disconnected";
      };
    }
  }

  addRectangle(newRect) {
    this.rectangles.push(newRect);
    localStorage.setItem("canvasData", JSON.stringify(this.rectangles));
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "canvasUpdate", data: newRect }));
    } else {
      console.error("WebSocket connection is not open.");
    }
  }
}

const canvasStore = new CanvasStore();
export default canvasStore;
