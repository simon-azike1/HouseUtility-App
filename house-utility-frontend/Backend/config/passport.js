// backend/config/passport.js - WORKING VERSION
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

console.log('🔧 Configuring Passport...');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔍 PASSPORT STRATEGY EXECUTED");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const googleEmail =
          profile.emails?.[0]?.value || profile._json?.email;

        if (!googleEmail) {
          console.error("❌ No email returned by Google");
          return done(null, false);
        }

        console.log("✅ Google email:", googleEmail);

        // 🔥 IMPORTANT FIX:
        // If pending email exists, use it
        // Otherwise fall back to Google email (Yahoo-safe)
        const pendingEmail =
          req.session?.pendingVerificationEmail || googleEmail;

        console.log("✅ Final email used:", pendingEmail);

        const user = {
          provider: "google",
          providerId: profile.id,
          email: pendingEmail,          // ← Yahoo works here
          googleEmail: googleEmail,
          displayName: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          emailVerified: true,           // ← Google already verified it
        };

        console.log("✅ User object:", user);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        return done(null, user);
      } catch (error) {
        console.error("❌ PASSPORT ERROR:", error);
        return done(error, null);
      }
    }
  )
);
export default passport;