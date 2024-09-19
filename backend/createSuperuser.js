// createSuperUser.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    console.log('Admin-Benutzer existiert bereits.');
    process.exit();
  }
 // Admin-Benutzer erstellen 
 // danach das Skipt ausführen mit: node createSuperUser.js
 // daran denken die Admin Daten nicht zu commiten
  const newUser = new User({
    username: '',
    email: '',
    password: '',
    isAdmin: true,
  });

  await newUser.save();
  console.log('Admin-Benutzer erfolgreich erstellt.');
  process.exit();
}).catch((err) => {
  console.error('Fehler beim Erstellen des Admin-Benutzers:', err);
  process.exit(1);
});
