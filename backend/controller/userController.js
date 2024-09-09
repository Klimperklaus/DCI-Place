const user = require('../model/userModel');
bcrypt = require('bcryptjs');

const handleError = (res, status, msg) => res.status(status).json({ msg });

// Registrieren

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return handleError(res, 400, 'Bitte alle Felder ausfüllen.');
  
    try {
      const existingUser = await user.findOne({ email });
      if (existingUser) return handleError(res, 400, 'Benutzer existiert bereits.');
  
      const newUser = new User({ username, email, password });
      await newUser.save();
        res.status(201).json({ msg: 'Registrierung erfolgreich.' });
    }
    catch (err) {
      res.status(500).json({ msg: err.message });
    }
    };

// Login

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return handleError(res, 400, 'Bitte alle Felder ausfüllen.');
  
    try {
      const user = await user.findOne({ email });
      if (!user) return handleError(res, 400, 'Benutzer existiert nicht.');
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return handleError(res, 400, 'Ungültige Anmeldedaten.');}
    catch {handleError(res, 500, err.message);
    }
    }

// Alle Benutzer anzeigen

exports.getUsers = async (req, res) => {
    try {
      const users = await user.find().select('-password');
      res.json(users);
    } catch {
      handleError(res, 500, 'Serverfehler');
    }
  }

// Profil aufrufen
exports.getProfile = async (req, res) => {
    try {
      const user = await user.findById(req.user.id).select('-password');
      res.json(user);
    } catch {
      handleError(res, 500, 'Serverfehler');
    }
  };


// Profil bearbeiten
exports.editUser = async (req, res) => {
    const { username, email, classTeam } = req.body;
    if (!username || !email || !classTeam) return handleError(res, 400, 'Bitte alle Felder ausfüllen.');
  
    try {
      await user.findByIdAndUpdate(req.user.id, { username, email, classTeam });
      res.json({ msg: 'Profil erfolgreich bearbeitet.' });
    } catch {
      handleError(res, 500, 'Serverfehler');
    }
  };

  // Profil löschen
exports.deleteUser = async (req, res) => {
    try {
      await user.findByIdAndDelete(req.user.id);
      res.json({ msg: 'Profil erfolgreich gelöscht.' });
    } catch {
      handleError(res, 500, 'Serverfehler');
    }
  };

  // Passwort ändern

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return handleError(res, 400, 'Bitte alle Felder ausfüllen.');
  
    try {
      const user = await user.findById(req.user.id);
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return handleError(res, 400, 'Ungültiges Passwort.');
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      res.json({ msg: 'Passwort erfolgreich geändert.' });
    } catch {
      handleError(res, 500, 'Serverfehler');
    }
    }
