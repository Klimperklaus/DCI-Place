import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};


// Registrieren

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return handleError(res, 400, "Benutzer existiert bereits.");

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser); 
    res.status(201).json({ msg: 'Registrierung erfolgreich.', token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const user = await User.findOne({ email });
    if (!user) return handleError(res, 400, "Benutzer existiert nicht.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültige Anmeldedaten.");

    const token = generateToken(user);
    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
      token, 
    });
  } catch (err) {
    handleError(res, 500, err.message);
  }
};

// Alle Benutzer anzeigen

const getUsers = async (req, res) => {
  try {
    const users = await users.find().select("-password");
    res.json(users);
  } catch {
    handleError(res, 500, "Serverfehler bei User Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await user.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email || !team)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    await user.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await user.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const user = await user.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch {
    handleError(res, 500, "Serverfehler");
  }
};

export {
  register,
  login,
  getUsers,
  getProfile,
  editUser,
  deleteUser,
  changePassword,
};
