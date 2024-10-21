import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Nicht autorisiert, kein Token vorhanden" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Zugriff verweigert, keine Adminrechte" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Nicht autorisiert, ungültiges Token" });
  }
};

export default adminMiddleware;
