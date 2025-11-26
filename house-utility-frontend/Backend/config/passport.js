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
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      passReqToCallback: true  // ✅ This passes req to the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 PASSPORT STRATEGY EXECUTED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log('📦 Google Profile:', JSON.stringify(profile, null, 2));
        console.log('📧 Session email:', req.session?.pendingVerificationEmail);
        // Extract email from Google profile
        const googleEmail = profile.emails?.[0]?.value || profile._json?.email;

        if (!googleEmail) {
          console.error('❌ No email in Google profile!');
          return done(null, false, { message: 'No email from Google' });
        }

        console.log('✅ Google email extracted:', googleEmail);

        // Get pending email from session
        const pendingEmail = req.session?.pendingVerificationEmail;
        
        console.log('✅ Pending email from session:', pendingEmail);

        // Create user object to pass to callback
        const user = {
          googleProfile: profile,
          googleEmail: googleEmail,
          pendingEmail: pendingEmail,
          displayName: profile.displayName,
          id: profile.id
        };

        console.log('✅ User object created:', JSON.stringify(user, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return done(null, user);

      } catch (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ PASSPORT STRATEGY ERROR:');
        console.error(error);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return done(error, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user);
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  console.log('📖 Deserializing user:', user);
  done(null, user);
});

console.log('✅ Passport configured successfully');

export default passport;