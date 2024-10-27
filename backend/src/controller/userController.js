// Import necessary modules
import User from "../models/userModel.js"; // Import the user model to interact with the database
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import jsonwebtoken for generating tokens

// Helper function to handle errors and send responses
const handleError = (res, status, msg) => res.status(status).json({ msg });

// Function to generate a token for the user
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h", // Token expiration time set to 24 hours
  });
};

// Register a new user
const register = async (req, res) => {
  const { username, email, password, team } = req.body; // Extract user data from the request body

  // Check if all required fields are filled
  if (!username || !email || !password) {
    return handleError(res, 400, "Bitte alle Felder ausfüllen."); // Send a 400 error response if any field is missing
  }

  try {
    const existingUser = await User.findOne({ email }); // Check if the user already exists in the database
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits."); // Send a 400 error response if the user already exists

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance with the provided data and hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      team,
    });
    await newUser.save(); // Save the new user to the database

    // Generate a token for the newly registered user
    const token = generateToken(newUser);

    // Set cookies with the generated token and additional options
    res.cookie("token", token, {
      httpOnly: true, // The cookie is accessible only by the web server (HTTP)
      secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS in production environment
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time set to 1 day
    });
    res.cookie("token_js", token, {
      httpOnly: false, // The cookie is accessible by JavaScript (client-side)
      secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS in production environment
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time set to 1 day
    });

    // Send a success response with the user information and token
    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id, // The ID of the newly registered user
        username: newUser.username, // The username of the newly registered user
        email: newUser.email, // The email of the newly registered user
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message }); // Send a 500 error response if an error occurs during registration
  }
};

// Login
const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if either email or password is missing
  if (!email || !password) {
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });
  }

  try {
    // Find the user by their email in the database
    const user = await User.findOne({ email });

    // If no user is found, return a message indicating that the user does not exist
    if (!user) {
      return res.status(400).json({ msg: "Benutzer existiert nicht." });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return a message indicating invalid login credentials
    if (!isMatch) {
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });
    }

    // Generate a token for the authenticated user
    const token = generateToken(user);

    // Set cookies with the generated token, ensuring httpOnly and secure settings are appropriate
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (1 day)
    });

    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (1 day)
    });

    // Return a success response with user information and login message
    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    // If an error occurs during the process, return a 500 status with the error message
    res.status(500).json({ msg: err.message });
  }
};

// Diese Funktion liest alle Benutzer aus der Datenbank und sendet sie als JSON an den Client.
// Nur Admins können diese Informationen sehen, deshalb ist die Anmeldung erforderlich.
// Die Passwörter der Benutzer werden nicht mitgeschickt, um eine Sicherheitsanfälligkeit zu vermeiden.
const getUsers = async (req, res) => {
  try {
    // Findet alle User-Dokumente in der Datenbank und schließt die Passwörter aus den Ergebnissen aus.
    const users = await User.find().select("-password");
    // Sendet die Liste der Benutzer als JSON an den Client.
    res.json(users);
  } catch (err) {
    // Bei einem Fehler wird eine allgemeine Fehlermeldung gesendet und die Details des Fehlers protokolliert.
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Diese Funktion liest das Profil eines Benutzers basierend auf seiner Benutzer-ID aus der Datenbank und sendet es als JSON an den Client.
// Auch hier werden die Passwörter ausgeschlossen, um eine Sicherheitsanfälligkeit zu vermeiden.
const getProfile = async (req, res) => {
  try {
    // Findet das Benutzerprofil basierend auf der in der Anfrage übergebenen Benutzer-ID und schließt die Passwörter aus den Ergebnissen aus.
    const user = await User.findById(req.user.id).select("-password");
    // Überprüft, ob das Profil existiert; falls nicht, wird eine Fehlermeldung gesendet.
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    // Sendet das Benutzerprofil als JSON an den Client.
    res.json(user);
  } catch (err) {
    // Bei einem Fehler wird eine allgemeine Fehlermeldung gesendet und die Details des Fehlers protokolliert.
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  // Extract username and email from the request body
  const { username, email, team } = req.body;

  // Check if both username and email are provided
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    // Update user profile by ID with the new values for username, email, and team
    await User.findByIdAndUpdate(req.user.id, { username, email, team });

    // Send a success response if the update is successful
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    // Handle server error if something goes wrong during the update process
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    // Delete user profile by ID
    await User.findByIdAndDelete(req.user.id);

    // Send a success response if the deletion is successful
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    // Handle server error if something goes wrong during the deletion process
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  // Extrahieren der alten und neuen Passwörter aus dem Request-Body
  const { oldPassword, newPassword } = req.body;

  // Überprüfen, ob alle benötigten Felder ausgefüllt sind
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    // Den Benutzer basierend auf der User-ID in der Anfrage finden
    const user = await User.findById(req.user.id);

    // Überprüfen, ob der Benutzer existiert
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");

    // Vergleichen Sie das eingegebene alte Passwort mit dem im System gespeicherten Passwort des Benutzers
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // Überprüfen, ob die Passwörter übereinstimmen
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");

    // Das neue Passwort hashen und in das Benutzer-Modell einfügen
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Speichern Sie die Änderungen im Benutzer-Modell im Datenbank
    await user.save();

    // Antwort mit einer Erfolgsmeldung senden
    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    // Bei einem Fehler auf dem Server antworten und einen allgemeinen Fehlermeldung senden
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  // Cookie löschen, indem ein neuer leerer Cookie mit demselben Namen gesetzt wird
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Sicherheit nur in der Produktion aktivieren
    expires: new Date(0), // Cookie auf Ablaufdatum setzen
  });

  // Antwort mit einer Erfolgsmeldung senden
  res.json({ msg: "Erfolgreich ausgeloggt" });
};

export {
  register,
  login,
  getUsers,
  getProfile,
  editUser,
  deleteUser,
  changePassword,
  logout,
};
