import fetch from "node-fetch";
import WebSocket from "ws";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY_WS = process.env.SECRET_KEY_WS;
const MONGO_URI = process.env.MONGO_URI;
const API_URL = "http://localhost:5000/api/login";
const WS_URL = "ws://localhost:3131";

const testConnections = async () => {
  try {
    // Test MongoDB connection
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connection successful");

    // Test user login and get JWT token
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "testuser", password: "testpassword" }),
    });

    const data = await response.json();
    console.log("Login response data:", data); // Debugging-Ausgabe

    if (!data.token) {
      throw new Error("Login failed, no token received");
    }

    const token = data.token;
    console.log("Login successful, token received:", token);

    // Test WebSocket connection
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.on("open", () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({ message: "Test message from client" }));
    });

    ws.on("message", (message) => {
      console.log("Message from server:", message);
      ws.close();
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  } catch (error) {
    console.error("Error during connection tests:", error);
  } finally {
    mongoose.connection.close();
  }
};

testConnections();
