// middleware/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import { sendEmail } from "../services/emailService.js";

// Serialize the user to store in session
passport.serializeUser((user, done) => {
  // Store the user ID in the session
  done(null, user.id);
});

// Deserialize the user from session
passport.deserializeUser(async (id, done) => {
  try {
    // Find and return the user by their ID
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return the user object
          return done(null, user);
        }

        // If the user does not exist, create a new user
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          // Optionally set default password
        });

        await user.save();

        // Send welcome email to the new user
        const subject = "Willkommen bei Pixel Wars!";
        const text = `Hallo ${user.username},\n\nDanke, dass du dich über Google bei Pixel Wars angemeldet hast. Viel Spaß!`;
        await sendEmail(user.email, subject, text);

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
