// server.js

import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/routes.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// CORS-Anfragen vom Frontend erlauben
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200,
};

// Middlwares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api", routes);
app.use(errorHandler);

// Session Middleware
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// Passport initialisieren
app.use(passport.initialize());
app.use(passport.session());

// MongoDB-Verbindung
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err.message}`);
  });
