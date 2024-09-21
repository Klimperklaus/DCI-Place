import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {sendEmail} from "../services/emailService.js";
import { validationResult } from "express-validator";

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Token generieren
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Registrieren
const register = async (req, res) => {
  const { username, email, password, team } = req.body;

  if (!username || !email || !password)
    return handleError(res, 400, 'Bitte alle Felder ausfüllen.');

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return handleError(res, 400, 'Benutzer existiert bereits.');

    const newUser = new User({ username, email, password, team });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 Tag
    });

    // Bestätigungs-E-Mail nach Registrierung
    const subject = 'Willkommen bei DeinerApp!';
    const text = `Hallo ${username},\n\nDanke, dass du dich bei DeinerApp registriert hast. Wir freuen uns, dich an Bord zu haben!`;
    await sendEmail(email, subject, text);

    res.status(201).json({
      msg: 'Registrierung erfolgreich. Bestätigungs-E-Mail gesendet.',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
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
    if (!user) return res.status(400).json({ msg: "Benutzer existiert nicht." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Ungültige Anmeldedaten." });

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login erfolgreich",
      user: { id: user._id, username: user.username, email: user.email }
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
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, 'Benutzer nicht gefunden.');

    await User.findByIdAndDelete(req.user.id);

    // Besätigungs E-Mail nach Kontolöschung
    const subject = 'Bestätigung der Kontolöschung';
    const text = `Hallo ${user.username},\n\nIhr Konto wurde erfolgreich gelöscht. Wir bedauern es, Sie zu verlieren. Falls Sie dies nicht waren, kontaktieren Sie bitte umgehend unseren Support.`;
    await sendEmail(user.email, subject, text);

    res.json({ msg: 'Profil erfolgreich gelöscht. Bestätigungs-E-Mail gesendet.' });
  } catch (err) {
    handleError(res, 500, 'Serverfehler');
  }
};

// Passwort ändern
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return handleError(res, 400, 'Bitte alle Felder ausfüllen.');

  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 404, 'Benutzer nicht gefunden.');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, 400, 'Ungültiges Passwort.');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    // Bestätigungs Mail nach Passwortänderung
    const subject = 'Ihr Passwort wurde geändert';
    const text = `Hallo ${user.username},\n\nIhr Passwort wurde erfolgreich geändert. Falls Sie dies nicht waren, kontaktieren Sie bitte umgehend unseren Support.`;
    await sendEmail(user.email, subject, text);

    res.json({ msg: 'Passwort erfolgreich geändert. Bestätigungs-E-Mail gesendet.' });
  } catch (err) {
    handleError(res, 500, 'Serverfehler');
  }
};

// Logout
const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0) });
  res.json({ msg: 'Erfolgreich ausgeloggt' });
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