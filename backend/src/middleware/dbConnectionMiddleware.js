import mongoose from "mongoose";

const checkDbConnection = (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    // 1 bedeutet verbunden
    next();
  } else {
    res.status(500).json({ msg: "Keine Verbindung zur Datenbank." });
  }
};

export default checkDbConnection;
