// userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true // für den Google-Login nicht nötig
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  team : {
    type : String,
    required : false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
}, { timestamps: true });


// Passwort vor dem Speichern hashen (nur wenn geändert)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) { 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
