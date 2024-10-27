import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definieren des Mongoose-Schemas für die User-Datenbank
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, // Typ der Eigenschaft ist ein String
      required: true, // Diese Eigenschaft ist Pflichtfeld
      unique: true, // Der Wert muss eindeutig sein
    },
    password: {
      type: String, // Typ der Eigenschaft ist ein String
      required: true, // Diese Eigenschaft ist Pflichtfeld
    },
    email: {
      type: String, // Typ der Eigenschaft ist ein String
      required: true, // Diese Eigenschaft ist Pflichtfeld
      unique: true, // Der Wert muss eindeutig sein
    },
    team: {
      type: String, // Typ der Eigenschaft ist ein String
      required: false, // Diese Eigenschaft ist nicht zwingend erforderlich
    },
    isAdmin: {
      type: Boolean, // Typ der Eigenschaft ist ein Boolean
      default: false, // Standardwert ist falsch (false)
    },
    googleId: {
      type: String, // Typ der Eigenschaft ist ein String
      unique: true, // Der Wert muss eindeutig sein
      sparse: true, // Es können null-Werte zugelassen werden (sparse index)
    },
  },
  { timestamps: true }
); // Zusatzfeld 'createdAt' und 'updatedAt' werden automatisch erstellt

// Vor dem Speichern des Dokuments wird das Passwort, falls geändert, mit einem Salt hashed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Wenn das Passwort nicht modifiziert wurde, dann weiter

  if (this.password) {
    const salt = await bcrypt.genSalt(10); // Salz erstellen
    this.password = await bcrypt.hash(this.password, salt); // Passwort hashen
  }
  next(); // Weiter zur nächsten Middleware oder zum Speichern
});

// Das Modell basierend auf dem Schema wird erstellt und exportiert
const User = mongoose.model("User", userSchema);

export default User;
