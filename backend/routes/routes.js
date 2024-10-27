import express from "express"; // Import the Express framework
import {
  getUsers,
  getProfile,
  register,
  login,
  deleteUser,
  editUser,
  changePassword,
  logout,
} from "../controller/userController.js"; // Import user-related functions from controller
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js"; // Import authentication and authorization middleware
import { body } from "express-validator"; // Import express-validator for request data validation
import passport from "passport"; // Import Passport for authentication
import "../middleware/passport.js"; // Import custom Passport configuration file
import session from "express-session"; // Import express-session for managing user sessions

const router = express.Router(); // Create a new router instance

// Sitzungs-Middleware hinzufügen
router.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key used to sign the session ID cookie
    resave: false, // Whether to save the session even if it hasn't been modified
    saveUninitialized: false, // Whether to save a new, uninitialized session to the store
  })
);

// Passport-Middleware initialisieren
router.use(passport.initialize()); // Initialize Passport for use in this application
router.use(passport.session()); // Use sessions to persist user authentication state between requests

// Validierung für die Registrierung
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Benutzername ist erforderlich."), // Validate that the username is not empty
    body("email").isEmail().withMessage("Ungültige E-Mail-Adresse."), // Validate that the email is valid
    body("password")
      .isLength({ min: 4 })
      .withMessage("Passwort muss mindestens 4 Zeichen lang sein."), // Validate that the password length is at least 4 characters
  ],
  register
);

// Validierung für den Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Ungültige E-Mail-Adresse."), // Validate that the email is valid
    body("password").notEmpty().withMessage("Passwort ist erforderlich."), // Validate that the password is not empty
  ],
  login
);

// Geschützte Routen
router.get("/profile", authMiddleware, getProfile); // Protected route to retrieve user profile
router.put("/profile", authMiddleware, editUser); // Protected route to update user profile
router.delete("/profile", authMiddleware, deleteUser); // Protected route to delete user account
router.put("/change-password", authMiddleware, changePassword); // Protected route to change user password
router.post("/logout", authMiddleware, logout); // Protected route to log out the user

// Admin-Routen
router.get("/users", authMiddleware, adminMiddleware, getUsers); // Route for admin users to view all users

// Google OAuth2 Login starten
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) // Redirect the user to Google's authorization page
);

// Google OAuth2 Callback-Route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }), // Handle the response from Google after authentication
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    }); // Create a JWT token for the user

    res.cookie("token", token, {
      httpOnly: true, // HTTP-only cookie to prevent client-side script access
      secure: process.env.NODE_ENV === "production", // Only set this cookie over HTTPS in production environment
      maxAge: 24 * 60 * 60 * 1000, // Set the expiration time of the cookie to 1 day
    });

    // Redirect the user to the profile page of the frontend application
    res.redirect("http://localhost:3000/profile");
  }
);

export default router; // Export the router for use in other parts of the application
