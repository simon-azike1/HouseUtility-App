// controllers/householdController.js
import Household from '../models/Household.js';
import User from '../models/User.js';

// @desc Get household details
// @route GET /api/household
// @access Private
export const getHousehold = async (req, res) => {
  try {
    if (!req.user.household) {
      return res.status(404).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const household = await Household.findById(req.user.household)
      .populate('members.user', 'name email');

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    res.json({
      success: true,
      data: household
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc Get household members
// @route GET /api/household/members
// @access Private
export const getMembers = async (req, res) => {
  try {
    if (!req.user.household) {
      return res.status(404).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const household = await Household.findById(req.user.household);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Fetch all users that belong to this household
    const members = await User.find({ household: household._id }).select('-password');

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc Join household with invite code
// @route POST /api/household/join
// @access Private
export const joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: 'Invite code is required'
      });
    }

    // Find household by invite code
    const household = await Household.findOne({ inviteCode });
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code'
      });
    }

    // Check if user already belongs to a household
    if (req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'You already belong to a household. Leave your current household first.'
      });
    }

    // Add user to household
    await household.addMember(req.user.id, 'member');

    // Update user's household
    const user = await User.findById(req.user.id);
    user.household = household._id;
    user.householdRole = 'member';
    await user.save();

    res.json({
      success: true,
      message: 'Successfully joined household',
      data: household
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc Update member role
// @route PUT /api/household/members/:userId/role
// @access Private (Admin only)
export const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const household = await Household.findById(req.user.household);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Check if user is admin (only admins can manage members)
    // Support both 'admin' and 'owner' roles for backward compatibility
    const isAdmin = household.isAdmin(req.user.id) || req.user.householdRole === 'owner';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only household admins can update member roles'
      });
    }

    // Find the member
    const member = household.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in household'
      });
    }

    // Cannot change admin/owner role (admin/owner is permanent for household creator)
    // Support both 'admin' and 'owner' roles for backward compatibility
    if (member.role === 'admin' || member.role === 'owner' || role === 'admin' || role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify admin role'
      });
    }

    // Only allow 'member' role changes (no admin/owner promotion)
    if (role !== 'member') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Only "member" role can be assigned'
      });
    }

    member.role = role;
    await household.save();

    // Update user's householdRole
    await User.findByIdAndUpdate(userId, { householdRole: role });

    res.json({
      success: true,
      message: 'Member role updated successfully',
      data: household
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc Remove member from household
// @route DELETE /api/household/members/:userId
// @access Private (Admin only)
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const household = await Household.findById(req.user.household);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Check if user is admin (support both 'admin' and 'owner' for backward compatibility)
    if (!household.isAdmin(req.user.id) && req.user.householdRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only household admins can remove members'
      });
    }

    // Don't allow removing admin or owner
    const member = household.members.find(m => m.user.toString() === userId);
    if (member && (member.role === 'admin' || member.role === 'owner')) {
      return res.status(403).json({
        success: false,
        message: 'Cannot remove household admin'
      });
    }

    // Remove member
    await household.removeMember(userId);

    // Update user
    await User.findByIdAndUpdate(userId, {
      household: null,
      householdRole: null
    });

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
