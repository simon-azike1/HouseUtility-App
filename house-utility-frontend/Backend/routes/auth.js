// backend/routes/auth.js
import express from 'express';
import passport from '../config/passport.js';
import {
  register,
  login,
  getMe,
  getAllUsers,
  updateProfile,
  checkVerificationStatus,
  resendVerification,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Basic routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/profile', protect, updateProfile);
router.get('/verification-status', checkVerificationStatus);
router.post('/resend-verification', resendVerification);

// ============================================
// ✅ REPLACE THESE TWO ROUTES:
// ============================================

// Step 1: Start OAuth - PASS EMAIL IN STATE
router.get('/google/verify', (req, res, next) => {
  const { email } = req.query;
  
  console.log('🚀 Starting OAuth for:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  // ✅ PASS EMAIL IN STATE (not session!)
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: email  // ✅ This will be passed back to callback
  })(req, res, next);
});

// Step 2: Callback - GET EMAIL FROM STATE
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/verify-email?error=auth_failed',
    session: false
  }),
  async (req, res) => {
    try {
      console.log('🚀 CALLBACK RECEIVED');
      
      // ✅ GET EMAIL FROM STATE (passed from first request)
      const pendingEmail = req.query.state;  // ✅ This is where email comes from!
      const googleEmail = req.user?.googleEmail;
      
      console.log('📧 Pending email from STATE:', pendingEmail);
      console.log('📧 Google email:', googleEmail);
      
      if (!pendingEmail) {
        console.error('❌ No email in state');
        return res.redirect('http://localhost:3000/verify-email?error=no_email');
      }
      
      if (!googleEmail) {
        console.error('❌ No Google email');
        return res.redirect('http://localhost:3000/verify-email?error=no_google_email');
      }
      
      // Compare emails
      if (String(googleEmail).toLowerCase() !== String(pendingEmail).toLowerCase()) {
        console.error('❌ EMAIL MISMATCH');
        return res.redirect(
          `http://localhost:3000/verify-email?error=email_mismatch&registered=${pendingEmail}&google=${googleEmail}`
        );
      }
      
      console.log('✅ Emails match!');
      
      // Verify user
      const User = (await import('../models/User.js')).default;
      const user = await User.findOne({ email: pendingEmail });
      
      if (!user) {
        return res.redirect('http://localhost:3000/verify-email?error=user_not_found');
      }
      
      user.isVerified = true;
      await user.save();
      console.log('✅ User verified!');
      
      // Generate token
      const jwt = (await import('jsonwebtoken')).default;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      // Redirect with HTML
      const redirectUrl = `http://localhost:3000/verify-success?token=${token}`;
      console.log('✅ Redirecting to:', redirectUrl);
      
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verified!</title>
            <meta http-equiv="refresh" content="2;url=${redirectUrl}">
          </head>
          <body style="font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 400px; margin: 0 auto;">
              <h1 style="color: #10b981; font-size: 48px;">✅</h1>
              <h2 style="color: #111;">Email Verified!</h2>
              <p style="color: #666;">Your account is now active.</p>
              <p style="color: #999; font-size: 14px;">Redirecting you in 2 seconds...</p>
            </div>
            <script>
              setTimeout(() => {
                window.location.href = '${redirectUrl}';
              }, 2000);
            </script>
          </body>
        </html>
      `);
      
    } catch (error) {
      console.error('❌ ERROR:', error);
      res.redirect('http://localhost:3000/verify-email?error=server_error');
    }
  }
);

export default router;