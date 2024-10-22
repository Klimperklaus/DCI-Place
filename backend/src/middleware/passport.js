// middleware/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import { sendEmail } from '../services/emailService.js';

// Benutzer in der Sitzung serialisieren
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Benutzer aus der Sitzung deserialisieren
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth2 konfigurieren
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
  callbackURL: process.env.GOOGLE_CALLBACK_URL, 
},
  async ( profile, done) => {
    try {
      // Prüfen, ob Benutzer bereits existiert
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Wenn Benutzer nicht existiert, neuen Benutzer erstellen
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        // Optional: Standardpasswort
      });

      await user.save();

      // Willkommens E-Mail 
      const subject = 'Willkommen bei Pixel Wars!';
      const text = `Hallo ${user.username},\n\nDanke, dass du dich über Google bei Pixel Wars angemeldet hast. Viel Spaß!`;
      await sendEmail(user.email, subject, text);

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));