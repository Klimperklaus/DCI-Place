import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true, returnDocument: "after" }
          );

          // Sende nur das aktualisierte Rechteck an alle Clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: updatedCanvasEntry,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;

/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;
    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { _id: newRect._id },
            {
              $set: {
                position_x: newRect.x,
                position_y: newRect.y,
                color: newRect.fill,
                timestamp: new Date(),
              },
            },
            { upsert: true, new: true, returnDocument: "after" }
          );
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: updatedCanvasEntry,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });


    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.send(
      JSON.stringify({ type: "error", message: "Token validation failed" })
    );
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;

/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true, returnDocument: "after" }
          );
          // Sende nur das aktualisierte Rechteck an alle Clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: updatedCanvasEntry,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.send(
      JSON.stringify({ type: "error", message: "Token validation failed" })
    );
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;


import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true, returnDocument: "after" }
          );

          // Sende nur das aktualisierte Rechteck an alle Clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: updatedCanvasEntry,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;
*/
/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true, returnDocument: "after" }
          );

          // Sende nur das aktualisierte Rechteck an alle Clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: updatedCanvasEntry,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;
*/
/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (
          parsedMessage.type === "canvasUpdate" &&
          parsedMessage.data &&
          parsedMessage.data.x &&
          parsedMessage.data.y &&
          parsedMessage.data.fill &&
          parsedMessage.data.width &&
          parsedMessage.data.height &&
          typeof parsedMessage.data.x === "number" &&
          typeof parsedMessage.data.y === "number" &&
          typeof parsedMessage.data.fill === "string" &&
          typeof parsedMessage.data.width === "number" &&
          typeof parsedMessage.data.height === "number" &&
          parsedMessage.data.x >= 0 &&
          parsedMessage.data.y >= 0 &&
          parsedMessage.data.width >= 0 &&
          parsedMessage.data.height >= 0
        ) {
          const newRect = parsedMessage.data;
          const updatedCanvasEntry = await Canvas.findOneAndUpdate(
            { position_x: newRect.x, position_y: newRect.y },
            { $set: { color: newRect.fill, timestamp: new Date() } },
            { upsert: true, new: true }
          );

          const allRectangles = await Canvas.find({});

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: allRectangles,
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;
*/

/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3131 });

wss.on("connection", function connection(ws, req) {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;

    ws.on("message", async function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "testMessage") {
          console.log("Testnachricht empfangen:", parsedMessage.message);
          ws.send(
            JSON.stringify({
              type: "testResponse",
              message: "Testnachricht vom Server empfangen",
            })
          );
        }

        if (parsedMessage.type === "canvasUpdate") {
          const newRect = parsedMessage.data;
          const canvasEntry = new Canvas(
            {
              _id: newRect._id,
              position_y: newRect.y,
              position_x: newRect.x,
              color: newRect.fill,
              width: newRect.width,
              height: newRect.height,
            },
            { timestamps: true }
          );

          await canvasEntry.save();

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "canvasUpdate",
                  data: {
                    _id: canvasEntry._id,
                    position_x: canvasEntry.position_x,
                    position_y: canvasEntry.position_y,
                    color: canvasEntry.color,
                    width: canvasEntry.width,
                    height: canvasEntry.height,
                  },
                })
              );
            }
          });
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "WebSocket connection established",
      })
    );
  } catch (err) {
    ws.close();
  }
});

wss.on("listening", () => {
  console.log(
    "WebSocketServer is running on Port ws://localhost:" + wss.address().port
  );
});

wss.on("error", (error) => {
  console.log("WebSocketServer error: ", error);
});

wss.on("close", () => {
  console.log("WebSocketServer closed");
});

export default wss;
*/
