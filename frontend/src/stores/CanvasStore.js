// Import necessary functions and classes from external libraries
import { makeAutoObservable } from "mobx";
import Cookies from "js-cookie";

// Define the CanvasStore class which will manage the state related to the canvas application
class CanvasStore {
  // Initialize an array to store rectangle data
  rectangles = [];

  // Initialize a variable to hold the WebSocket connection
  ws = null;

  // Initialize a string to represent the current connection status of the WebSocket
  connectionStatus = "Disconnected";

  // Initialize a boolean to determine if the user is authenticated
  isAuthenticated = false;

  // The constructor function initializes the observable state using makeAutoObservable from MobX
  constructor() {
    makeAutoObservable(this);

    // Call the checkAuthentication method when the CanvasStore instance is created
    this.checkAuthentication();
  }

  // Define a method to check if the user is authenticated based on a token stored in cookies
  checkAuthentication() {
    const token = Cookies.get("token_js"); // Retrieve the token from cookies

    // If the token exists, set the authentication status to true and fetch canvas data
    if (token) {
      this.isAuthenticated = true;
      this.fetchCanvasData();
    }
  }

  // Function to fetch canvas data from local storage if available, otherwise fetch it from the database
  fetchCanvasData() {
    // Attempt to retrieve cached canvas data from localStorage
    const cachedCanvasData = localStorage.getItem("canvasData");

    // Check if there is any cached data in localStorage
    if (cachedCanvasData) {
      // If cached data exists, parse and set it as the rectangles property of the CanvasStore instance
      this.rectangles = JSON.parse(cachedCanvasData);
    } else {
      // If no cached data is found, fetch the data from the database
      this.fetchDbData();
    }
  }

  // Function to fetch data from the API using token stored in cookies
  async fetchDbData() {
    // Retrieve the token from the cookie named "token_js"
    const token = Cookies.get("token_js");

    // Check if the token exists; if not, log an error message and return
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }

    try {
      // Make a fetch request to the API endpoint with the Authorization header containing the token
      const response = await fetch("http://localhost:5000/api/canvas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Include cookies in the request
      });

      // If the response status is 401 (Unauthorized), log an error message, remove the token from cookies, and redirect to the login page
      if (response.status === 401) {
        console.error("Token has expired or is invalid.");
        Cookies.remove("token");
        window.location.href = "/login";
        return;
      }

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON data from the response
      const data = await response.json();

      // Check if the fetched data is an array; if so, update the rectangles state and store it in localStorage
      if (Array.isArray(data)) {
        this.rectangles = data;
        localStorage.setItem("canvasData", JSON.stringify(data));
      } else {
        console.error("Error fetching canvas data: ", data.msg); // Log an error message for non-array data
      }
    } catch (error) {
      console.error("Error fetching canvas data: ", error); // Catch and log any errors that occur during the fetch process
    }
  }

  // This function initializes and manages a WebSocket connection to the server.
  connectWebSocket() {
    // Retrieve the token from cookies.
    const token = Cookies.get("token_js");

    // Check if the token exists in the cookies.
    if (!token) {
      console.error("No token found in cookies.");
      return; // Exit the function if no token is available.
    }

    // If a WebSocket connection already exists, close it before creating a new one.
    if (this.ws) {
      this.ws.close();
      this.ws = null; // Set the WebSocket instance to null after closing.
    } else {
      // Create a new WebSocket instance with the specified URL and token.
      this.ws = new WebSocket(`ws://localhost:3131?token=${token}`);

      // Event listener for when the WebSocket connection is successfully opened.
      this.ws.onopen = () => {
        console.log("WebSocket connection established");
        this.connectionStatus = "Connected"; // Update the connection status to connected.

        // Send a test message to the server after connection is established.
        this.ws.send(
          JSON.stringify({ type: "testMessage", message: "Hello from client" })
        );
      };

      // Event listener for when messages are received from the WebSocket server.
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Parse the incoming message as JSON.
          console.log("Data received from WebSocket:", data);

          // Check if the received message type is a canvas update.
          if (data.type === "canvasUpdate") {
            this.rectangles = data.data; // Update the rectangles with new data from the server.
            localStorage.setItem("canvasData", JSON.stringify(data.data)); // Store the updated canvas data in local storage.
          }
        } catch (error) {
          console.error("Error parsing message from server: ", error); // Log any errors that occur during message parsing.
        }
      };

      // Event listener for any WebSocket connection errors.
      this.ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };

      // Event listener for when the WebSocket connection is closed.
      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.connectionStatus = "Disconnected"; // Update the connection status to disconnected.
      };
    }
  }

  // CanvasStore.js: Method to add a new rectangle to the canvas and save it in local storage, then send an update via WebSocket if connected.
  addRectangle(newRect) {
    // Add the new rectangle to the list of rectangles stored in this state.
    this.rectangles.push(newRect);

    // Save the updated list of rectangles to localStorage for persistence.
    localStorage.setItem("canvasData", JSON.stringify(this.rectangles));

    // Check if a WebSocket connection (this.ws) is available and that it's open.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // If the WebSocket is open, send an update containing the new rectangle data to other connected clients or servers.
      this.ws.send(JSON.stringify({ type: "canvasUpdate", data: newRect }));
    } else {
      // Log an error message if the WebSocket connection is not open.
      console.error("WebSocket connection is not open.");
    }
  }
}

const canvasStore = new CanvasStore();
export default canvasStore;
