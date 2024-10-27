// userModel.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// This middleware is a pre-save hook that encrypts the user's password before saving it to the database.
// It checks if the password has been modified; if not, it skips encryption and proceeds with the next function in the middleware chain.
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified since the last save operation.
  if (!this.isModified("password")) return next();

  // Generate a salt which is used to hash the password. The '10' specifies the number of rounds the algorithm should run for.
  const salt = await bcrypt.genSalt(10);

  // Hash (encrypt) the user's password with the generated salt and store it in the database.
  this.password = await bcrypt.hash(this.password, salt);

  // Call the next middleware function or save operation after hashing the password.
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
