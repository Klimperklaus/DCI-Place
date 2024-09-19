// authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Token aus dem Cookie lesen

  if (!token) {
    return res.status(401).json({ msg: 'Kein Token, Zugriff verweigert.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // isAdmin überprüfen
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Benutzer nicht gefunden.' });

    req.user.isAdmin = user.isAdmin;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Ungültiges Token.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Zugriff verweigert. Keine Admin-Rechte.' });
  }
  next();
};

export { authMiddleware, adminMiddleware };