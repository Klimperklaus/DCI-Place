import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;
  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits.");
    const newUser = new User({ username, email, password, team });
    await newUser.save();
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Benutzer existiert nicht." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("username", user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Alle Benutzer anzeigen (nur für Admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    res.json(user);
  } catch (err) {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    await User.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.json({ msg: "Erfolgreich ausgeloggt" });
};

// Funktion zum Erhöhen des Zählers und Speichern in der MongoDB
export const incrementPixelCount = async (req, res) => {
  try {
    const userId = req.user.id; // Angenommen, die Benutzer-ID ist im JWT-Token enthalten
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Benutzer nicht gefunden" });
    }

    user.clicks += 1;

    // Überprüfen, ob der Benutzer 500 Pixel gesetzt hat
    if (user.clicks >= 500 && !user.rewarded) {
      user.rewarded = true;
      user.timer = user.timer / 2; // Timer halbieren
    }

    await user.save();
    res.json({
      msg: "Pixel-Zähler erhöht",
      clicks: user.clicks,
      timer: user.timer,
    });
  } catch (error) {
    console.error("Fehler beim Erhöhen des Pixel-Zählers:", error);
    res.status(500).json({ msg: "Serverfehler" });
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
  logout,
  incrementPixelCount,
};

/*
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;
  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits.");
    const newUser = new User({ username, email, password, team });
    await newUser.save();
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Benutzer existiert nicht." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Alle Benutzer anzeigen (nur für Admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    res.json(user);
  } catch (err) {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    await User.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");
  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
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


import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;

  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits.");

    const newUser = new User({ username, email, password, team });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Benutzer existiert nicht." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("token_js", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Alle Benutzer anzeigen (nur für Admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    res.json(user);
  } catch (err) {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    await User.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
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
*/
/*
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;

  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits.");

    const newUser = new User({ username, email, password, team });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Benutzer existiert nicht." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Alle Benutzer anzeigen (nur für Admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    res.json(user);
  } catch (err) {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    await User.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
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
*/
/*

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;

  if (!username || !email || !password)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return handleError(res, 400, "Benutzer existiert bereits.");

    const newUser = new User({ username, email, password, team });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Benutzer existiert nicht." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Ungültige Anmeldedaten." });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Alle Benutzer anzeigen (nur für Admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    handleError(res, 500, "Serverfehler bei User-Aufruf");
  }
};

// Profil aufrufen
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");
    res.json(user);
  } catch (err) {
    handleError(res, 500, "Serverfehler beim Profilaufruf");
  }
};

// Profil bearbeiten
const editUser = async (req, res) => {
  const { username, email, team } = req.body;
  if (!username || !email)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    await User.findByIdAndUpdate(req.user.id, { username, email, team });
    res.json({ msg: "Profil erfolgreich bearbeitet." });
  } catch (err) {
    handleError(res, 500, "Serverfehler bei Profilbearbeitung");
  }
};

// Profil löschen
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Profil erfolgreich gelöscht." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return handleError(res, 400, "Bitte alle Felder ausfüllen.");

  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, "Benutzer nicht gefunden.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, "Ungültiges Passwort.");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ msg: "Passwort erfolgreich geändert." });
  } catch (err) {
    handleError(res, 500, "Serverfehler");
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
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
*/
