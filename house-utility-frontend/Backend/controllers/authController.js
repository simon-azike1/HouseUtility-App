// controllers/authController.js
import User from '../models/User.js';
import Household from '../models/Household.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import crypto from 'crypto'; // ✅ ADD THIS
import { sendVerificationEmail } from '../utils/sendEmail.js'; // ✅ ADD THIS

export const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

export const clearAuthCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/'
  });
};

// @desc Register user (unverified)
// @desc Register user (unverified) and send verification email
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    console.log('📝 Creating user:', email);
    console.log('🔑 Verification token generated');

    // ✅ Create unverified user with verification token
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken,
      verificationExpires,
      hasCompletedOnboarding: false
    });

    console.log('✅ User created:', user.email);

    // ✅ Send verification email to ANY email provider (Yahoo, Outlook, Gmail, etc.)
    const emailResult = await sendVerificationEmail(email, name, verificationToken);

    if (!emailResult.success) {
      console.error('❌ Failed to send verification email:', emailResult.error);
      // Delete user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.' 
      });
    }

    console.log('✅ Verification email sent to:', email);

    // ✅ Return success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      userId: user._id,
      email: user.email,
      needsVerification: true,
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user (only if verified)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified. Please verify your email to login.',
        needsVerification: true,
        email: user.email,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ For existing users created before onboarding feature, set hasCompletedOnboarding to true
    if (user.hasCompletedOnboarding === undefined || user.hasCompletedOnboarding === null) {
      user.hasCompletedOnboarding = true;
    }

    // ✅ Track if this is first login (for welcome message)
    const isFirstLogin = !user.lastLogin;

    // ✅ Update last login time
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);

    const includeToken = process.env.ENABLE_TOKEN_FALLBACK === 'true';

    res.json({
      success: true,
      ...(includeToken ? { token } : {}),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        household: user.household,
        householdRole: user.householdRole,
        hasCompletedOnboarding: user.hasCompletedOnboarding, // ✅ Include in response
        isFirstLogin: isFirstLogin, // ✅ Flag for welcome message
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
export const logout = async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
};

// ✅ @desc Verify email with Google OAuth
// This is called after successful Google OAuth callback
export const verifyEmailWithGoogle = async (req, res) => {
  try {
    const { googleEmail, registeredEmail, inviteCode } = req.body;

    // Check if emails match (case-insensitive)
    if (googleEmail.toLowerCase() !== registeredEmail.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Email mismatch',
        error: `Google email (${googleEmail}) does not match registered email (${registeredEmail})`,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: registeredEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.isVerified) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        success: true,
        message: 'Email already verified',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          household: user.household,
          householdRole: user.householdRole,
        }
      });
    }

    // ✅ Mark user as verified
    user.isVerified = true;

    // ✅ Create household if user doesn't have one
    console.log(`📊 Household status for user ${user.email}: ${user.household ? 'HAS HOUSEHOLD' : 'NO HOUSEHOLD'}`);

    if (!user.household) {
      console.log('🏠 Creating/joining household for user...');

      try {
        // Helper function to generate invite code
        const generateInviteCode = () => {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let code = '';
          for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };

        if (inviteCode) {
          // User has an invite code - join existing household
          console.log(`🔍 Looking for household with invite code: ${inviteCode}`);
          const household = await Household.findOne({ inviteCode });

          if (household) {
            console.log(`✅ Found household: ${household.name} (ID: ${household._id})`);

            // Add user to household using the model method
            try {
              await household.addMember(user._id, 'member');
              console.log(`✅ User added to household using addMember method`);
            } catch (addError) {
              if (addError.message.includes('already a member')) {
                console.log(`ℹ️ User already in household members`);
              } else {
                throw addError;
              }
            }

            user.household = household._id;
            user.householdRole = 'member';
            console.log(`✅ User ${user.email} joined household ${household.name} with code ${inviteCode}`);
          } else {
            console.log(`⚠️ Invalid invite code ${inviteCode}, creating new household for user ${user.email}`);

            // Invalid code - create own household as fallback
            const newHousehold = await Household.create({
              name: `${user.name}'s Household`,
              owner: user._id,
              inviteCode: generateInviteCode(),
              members: [{
                user: user._id,
                role: 'admin',
                joinedAt: new Date()
              }]
            });

            console.log(`✅ Created fallback household: ${newHousehold.name} (ID: ${newHousehold._id}, Code: ${newHousehold.inviteCode})`);
            user.household = newHousehold._id;
            user.householdRole = 'admin';
          }
        } else {
          // No invite code - create own household
          console.log(`🆕 No invite code - creating new household for ${user.email}`);

          const household = await Household.create({
            name: `${user.name}'s Household`,
            owner: user._id,
            inviteCode: generateInviteCode(),
            members: [{
              user: user._id,
              role: 'admin',
              joinedAt: new Date()
            }]
          });

          console.log(`✅ Created household: ${household.name} (ID: ${household._id}, Code: ${household.inviteCode})`);
          user.household = household._id;
          user.householdRole = 'admin';
        }

        // ✅ Verify household was set
        if (!user.household) {
          throw new Error('Household creation failed - user.household is still null');
        }

        console.log(`✅ Household assignment complete - User household: ${user.household}, Role: ${user.householdRole}`);

      } catch (householdError) {
        console.error('❌ ERROR during household creation:', householdError);
        console.error('❌ Stack trace:', householdError.stack);
        
        // ✅ FIXED: Don't continue - return error response
        return res.status(500).json({ 
          success: false,
          message: 'Failed to create or join household',
          error: householdError.message 
        });
      }
    } else {
      console.log(`ℹ️ User already has household: ${user.household}`);
    }

    // ✅ Save user with household information
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        household: user.household,
        householdRole: user.householdRole,
      }
    });
  } catch (err) {
    console.error('❌ ERROR in verifyEmailWithGoogle:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ✅ @desc Check verification status
export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      email: user.email,
      isVerified: user.isVerified,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ @desc Resend verification (for future email-based verification)
// ✅ @desc Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Resending verification to:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // ✅ Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    console.log('🔑 New verification token generated');

    // ✅ Send verification email
    const emailResult = await sendVerificationEmail(email, user.name, verificationToken);

    if (!emailResult.success) {
      console.error('❌ Failed to send verification email:', emailResult.error);
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.' 
      });
    }

    console.log('✅ Verification email resent to:', email);

    res.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
      email: user.email,
    });

  } catch (err) {
    console.error('❌ Resend verification error:', err);
    res.status(500).json({ message: err.message });
  }
};
// ✅ @desc Verify email with token (from email link)
// ✅ @desc Verify email with token (from email link)
// ✅ @desc Verify email with token (from email link)
export const verifyEmailWithToken = async (req, res) => {
  try {
    const { token, inviteCode } = req.body; // ✅ Accept inviteCode

    console.log('🔍 Verifying email with token:', token);
    console.log('📝 Invite code:', inviteCode || 'none');

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Verification token is required' 
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }

    console.log('✅ User found:', user.email);

    // Check if already verified
    if (user.isVerified) {
      console.log('ℹ️ User already verified');
      return res.json({
        success: true,
        message: 'Email already verified! You can now log in.',
        alreadyVerified: true,
      });
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    // ✅ CREATE OR JOIN HOUSEHOLD
    console.log(`📊 Household status for user ${user.email}: ${user.household ? 'HAS HOUSEHOLD' : 'NO HOUSEHOLD'}`);

    if (!user.household) {
      console.log('🏠 Creating/joining household for user...');

      try {
        // Helper function to generate invite code
        const generateInviteCode = () => {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let code = '';
          for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };

        if (inviteCode) {
          // ✅ User has an invite code - join existing household
          console.log(`🔍 Looking for household with invite code: ${inviteCode}`);
          const household = await Household.findOne({ inviteCode });

          if (household) {
            console.log(`✅ Found household: ${household.name} (ID: ${household._id})`);

            // Add user to household if not already a member
            if (!household.members.some(m => m.user.toString() === user._id.toString())) {
              console.log(`➕ Adding user ${user.email} to household members`);
              household.members.push({
                user: user._id,
                role: 'member',
                joinedAt: new Date()
              });
              await household.save();
              console.log(`✅ User added to household members array`);
            } else {
              console.log(`ℹ️ User already in household members`);
            }

            user.household = household._id;
            user.householdRole = 'member';
            console.log(`✅ User ${user.email} joined household ${household.name} with code ${inviteCode}`);
          } else {
            console.log(`⚠️ Invalid invite code ${inviteCode}, creating new household for user ${user.email}`);

            // Invalid code - create own household as fallback
            const newHousehold = await Household.create({
              name: `${user.name}'s Household`,
              owner: user._id,
              inviteCode: generateInviteCode(),
              members: [{
                user: user._id,
                role: 'admin',
                joinedAt: new Date()
              }]
            });

            console.log(`✅ Created fallback household: ${newHousehold.name} (ID: ${newHousehold._id}, Code: ${newHousehold.inviteCode})`);
            user.household = newHousehold._id;
            user.householdRole = 'admin';
          }
        } else {
          // ✅ No invite code - create own household as admin
          console.log(`🆕 No invite code - creating new household for ${user.email}`);

          const household = await Household.create({
            name: `${user.name}'s Household`,
            owner: user._id,
            inviteCode: generateInviteCode(),
            members: [{
              user: user._id,
              role: 'admin',
              joinedAt: new Date()
            }]
          });

          console.log(`✅ Created household: ${household.name} (ID: ${household._id}, Code: ${household.inviteCode})`);
          user.household = household._id;
          user.householdRole = 'admin';
        }

        // ✅ Verify household was set
        if (!user.household) {
          throw new Error('Household creation failed - user.household is still null');
        }

        console.log(`✅ Household assignment complete - User household: ${user.household}, Role: ${user.householdRole}`);

      } catch (householdError) {
        console.error('❌ ERROR during household creation:', householdError);
        console.error('❌ Stack trace:', householdError.stack);
        // Continue with verification even if household creation fails
        console.log('⚠️ Continuing with verification despite household error');
      }
    } else {
      console.log(`ℹ️ User already has household: ${user.household}`);
    }

    await user.save();

    console.log('✅ Email verified successfully for:', user.email);

    // Generate token + set cookie for auto-login
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, authToken);

    const includeToken = process.env.ENABLE_TOKEN_FALLBACK === 'true';

    res.json({ 
      success: true,
      message: 'Email verified successfully! Redirecting you to your dashboard.',
      email: user.email,
      ...(includeToken ? { token: authToken } : {})
    });

  } catch (err) {
    console.error('❌ Email verification error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Verification failed. Please try again.' 
    });
  }
};
// @desc Get logged-in user data
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('household', 'name inviteCode');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all users (household members)
// @route GET /api/auth/users
// @access Private
export const getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let users;

    // If user is admin, return all users
    if (currentUser.role === 'admin') {
      users = await User.find()
        .select('-password')
        .populate('household', 'name inviteCode');
    }
    // If user has household, return household members
    else if (currentUser.household) {
      users = await User.find({ household: currentUser.household })
        .select('-password')
        .populate('household', 'name inviteCode');
    }
    // Otherwise return just the current user
    else {
      users = [currentUser];
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Upload profile picture
// @route POST /api/auth/upload-profile-picture
// @access Private
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'house-utility/profile-pictures',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: result.secure_url,
      user
    });
  } catch (err) {
    console.error('Profile picture upload error:', err);
    res.status(500).json({ message: 'Failed to upload profile picture', error: err.message });
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
// @access Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password using the model's comparePassword method
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // ✅ Set new password - the pre-save hook will hash it automatically
    // Don't hash manually here to avoid double-hashing
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

// @desc Update account settings (preferences and notifications)
// @route PUT /api/auth/settings
// @access Private
// Get user settings
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationPreferences preferences');

    res.json({
      success: true,
      notifications: user.notificationPreferences || {},
      preferences: user.preferences || {
        language: 'en',
        timezone: 'GMT+1',
        currency: 'MAD',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { notifications, preferences } = req.body;

    const updates = {};
    if (notifications) updates.notificationPreferences = notifications;
    if (preferences) updates.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      user
    });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: 'Failed to update settings', error: err.message });
  }
};


