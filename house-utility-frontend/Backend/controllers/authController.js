// controllers/authController.js
import User from '../models/User.js';
import Household from '../models/Household.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

    // ✅ Create household if user doesn't have one
    if (!user.household) {
      // Generate unique invite code
      const generateInviteCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      // Create household
      const household = await Household.create({
        name: `${user.name}'s Household`,
        owner: user._id,
        inviteCode: generateInviteCode(),
        members: [{
          user: user._id,
          role: 'owner',
          joinedAt: new Date()
        }]
      });

      // Link user to household
      user.household = household._id;
      user.householdRole = 'owner';
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