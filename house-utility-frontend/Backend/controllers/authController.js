// controllers/authController.js
import User from '../models/User.js';
import Household from '../models/Household.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';

// @desc Register user (unverified)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Create unverified user
    const user = await User.create({ 
      name, 
      email, 
      password,
      isVerified: false // Explicitly set as unverified
    });

    // ✅ Don't generate token yet - user needs to verify first
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      userId: user._id,
      email: user.email,
      needsVerification: true, // Signal to frontend
    });
  } catch (err) {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
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
    res.status(500).json({ message: err.message });
  }
};

// ✅ @desc Verify email with Google OAuth
// This is called after successful Google OAuth callback
export const verifyEmailWithGoogle = async (req, res) => {
  try {
    const { googleEmail, registeredEmail } = req.body;

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
        }
      });
    }

    // ✅ Mark user as verified
    user.isVerified = true;

    // ✅ Check for invite code in request body
    const { inviteCode } = req.body;

    // ✅ Create household if user doesn't have one - with comprehensive error handling
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
        // Don't throw - let user continue with verification, they can join/create household later
        console.log('⚠️ Continuing with verification despite household error');
      }
    } else {
      console.log(`ℹ️ User already has household: ${user.household}`);
    }

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
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // For now, just return success
    // Later you can add email sending logic here
    res.json({
      success: true,
      message: 'Verification instructions sent',
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    // Fetch all users excluding passwords
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
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

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
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