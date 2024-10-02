// routes.js

import express from "express";
import {getUsers, getProfile,  register,  login,  deleteUser,  editUser, 
  changePassword,  logout,} from "../controller/userController.js";
import { authMiddleware, adminMiddleware,} from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import passport from "passport";
import '../middleware/passport.js';
import session from 'express-session';

const router = express.Router();

// Sitzungs-Middleware hinzufügen
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport-Middleware initialisieren
router.use(passport.initialize());
router.use(passport.session());

// Validierung für die Registrierung
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Benutzername ist erforderlich."),
    body("email").isEmail().withMessage("Ungültige E-Mail-Adresse."),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Passwort muss mindestens 4 Zeichen lang sein."),
  ],
  register
);

// Validierung für den Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Ungültige E-Mail-Adresse."),
    body("password").notEmpty().withMessage("Passwort ist erforderlich."),
  ],
  login
);

// Geschützte Routen
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, editUser);
router.delete("/profile", authMiddleware, deleteUser);
router.put("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logout);

// Admin-Routen
router.get("/users", authMiddleware, adminMiddleware, getUsers);

// Google OAuth2 Login starten
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth2 Callback-Route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Nur HTTPS in Produktion
      maxAge: 24 * 60 * 60 * 1000, // 1 Tag
    });

    // Zum Frontend weiterleiten 
    res.redirect('http://localhost:3000/profile');
  }
);

export default router;
