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

// Get frontend URL from environment variable
const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:3000';
};

// Basic routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/profile', protect, updateProfile);
router.get('/verification-status', checkVerificationStatus);
router.post('/resend-verification', resendVerification);

// ============================================
// ✅ GOOGLE OAUTH ROUTES WITH ENVIRONMENT VARIABLES
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
    failureRedirect: `${getFrontendUrl()}/verify-email?error=auth_failed`,
    session: false
  }),
  async (req, res) => {
    try {
      const frontendUrl = getFrontendUrl();
      console.log('🚀 CALLBACK RECEIVED');
      console.log('📍 Frontend URL:', frontendUrl);
      
      // ✅ GET EMAIL FROM STATE (passed from first request)
      const pendingEmail = req.query.state;  // ✅ This is where email comes from!
      const googleEmail = req.user?.googleEmail;
      
      console.log('📧 Pending email from STATE:', pendingEmail);
      console.log('📧 Google email:', googleEmail);
      
      if (!pendingEmail) {
        console.error('❌ No email in state');
        return res.redirect(`${frontendUrl}/verify-email?error=no_email`);
      }
      
      if (!googleEmail) {
        console.error('❌ No Google email');
        return res.redirect(`${frontendUrl}/verify-email?error=no_google_email`);
      }
      
      // Compare emails
      if (String(googleEmail).toLowerCase() !== String(pendingEmail).toLowerCase()) {
        console.error('❌ EMAIL MISMATCH');
        return res.redirect(
          `${frontendUrl}/verify-email?error=email_mismatch&registered=${pendingEmail}&google=${googleEmail}`
        );
      }
      
      console.log('✅ Emails match!');
      
      // Verify user
      const User = (await import('../models/User.js')).default;
      const user = await User.findOne({ email: pendingEmail });
      
      if (!user) {
        return res.redirect(`${frontendUrl}/verify-email?error=user_not_found`);
      }
      
      user.isVerified = true;
      await user.save();
      console.log('✅ User verified!');
      
      // Generate token
      const jwt = (await import('jsonwebtoken')).default;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      // Redirect with HTML
      const redirectUrl = `${frontendUrl}/verify-success?token=${token}`;
      console.log('✅ Redirecting to:', redirectUrl);
      
      res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified Successfully! ✓</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
        }
        
        .container {
          background: white;
          padding: 60px 40px;
          border-radius: 24px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .success-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
          position: relative;
          animation: checkmark 0.8s ease-in-out;
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        
        .checkmark {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }
        
        .checkmark::before {
          content: '✓';
          color: white;
          font-size: 60px;
          font-weight: bold;
          animation: checkPop 0.3s 0.5s ease-out backwards;
        }
        
        @keyframes checkPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        h1 {
          color: #111827;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          animation: fadeIn 0.6s 0.3s ease-out backwards;
        }
        
        .subtitle {
          color: #6b7280;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 30px;
          animation: fadeIn 0.6s 0.5s ease-out backwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .redirect-info {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 12px;
          margin-top: 30px;
          animation: fadeIn 0.6s 0.7s ease-out backwards;
        }
        
        .redirect-text {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          animation: progress 2s linear;
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 1s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .sparkle:nth-child(1) {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }
        
        .sparkle:nth-child(2) {
          top: 60%;
          left: 80%;
          animation-delay: 0.3s;
        }
        
        .sparkle:nth-child(3) {
          top: 80%;
          left: 30%;
          animation-delay: 0.6s;
        }
        
        .sparkle:nth-child(4) {
          top: 30%;
          right: 10%;
          animation-delay: 0.9s;
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 40px 24px;
          }
          
          h1 {
            font-size: 26px;
          }
          
          .subtitle {
            font-size: 16px;
          }
          
          .success-icon {
            width: 80px;
            height: 80px;
          }
          
          .checkmark::before {
            font-size: 48px;
          }
        }
      </style>
    </head>
    <body>
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      
      <div class="container">
        <div class="success-icon">
          <div class="checkmark"></div>
        </div>
        
        <h1>Email Verified!</h1>
        <p class="subtitle">
          Your account has been successfully verified and is now active. 
          Welcome to HouseUtility!
        </p>
        
        <div class="redirect-info">
          <p class="redirect-text">Redirecting you to the app...</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
      
      <script>
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '${redirectUrl}';
        }, 2000);
        
        // Fallback: Show manual link if redirect fails
        setTimeout(() => {
          const redirectInfo = document.querySelector('.redirect-info');
          if (redirectInfo) {
            redirectInfo.innerHTML = \`
              <p class="redirect-text" style="color: #ef4444;">
                Automatic redirect failed.
              </p>
              <a href="${redirectUrl}" style="
                display: inline-block;
                margin-top: 12px;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: transform 0.2s;
              " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Click here to continue
              </a>
            \`;
          }
        }, 5000);
      </script>
    </body>
  </html>
`);
      
    } catch (error) {
      console.error('❌ ERROR:', error);
      const frontendUrl = getFrontendUrl();
      res.redirect(`${frontendUrl}/verify-email?error=server_error`);
    }
  }
);

export default router;