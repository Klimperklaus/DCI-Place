// routes.js

import express from "express";
import {
  getUsers,
  getProfile,
  register,
  login,
  deleteUser,
  editUser,
  changePassword,
  logout,
} from "../controller/userController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

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

export default router;
