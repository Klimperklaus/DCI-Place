import app from "./config/server.js";
import { connectDB } from "./config/database.js";
import wss from "./websocket/websocketServer.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
