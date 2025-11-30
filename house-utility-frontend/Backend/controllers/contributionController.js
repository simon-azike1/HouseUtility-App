// controllers/contributionController.js
import Contribution from '../models/Contribution.js';
import Household from '../models/Household.js';
import User from '../models/User.js';

// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Private
export const getContributions = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const contributions = await Contribution.find({ household: req.user.household })
      .populate('user', 'name email')
      .populate('household', 'name')
      .sort({ contributionDate: -1 });

    const total = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);

    res.status(200).json({
      success: true,
      count: contributions.length,
      total,
      data: contributions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contributions',
      error: error.message,
    });
  }
};

// @desc    Get single contribution
// @route   GET /api/contributions/:id
// @access  Private
export const getContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('user', 'name email')
      .populate('household', 'name');

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    // Check if contribution belongs to user's household
    if (contribution.household._id.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this contribution' });
    }

    res.status(200).json({ success: true, data: contribution });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contribution', error: error.message });
  }
};

// @desc    Create new contribution
// @route   POST /api/contributions
// @access  Private
export const createContribution = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    // Add user and household to req.body
    req.body.user = req.user.id;
    req.body.household = req.user.household;
    req.body.createdBy = req.user.id;

    const contribution = await Contribution.create(req.body);

    // Populate user and household data
    await contribution.populate('user', 'name email');
    await contribution.populate('household', 'name');

    res.status(201).json({
      success: true,
      message: 'Contribution created successfully',
      data: contribution,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create contribution',
      error: error.message,
    });
  }
};

// @desc    Update contribution
// @route   PUT /api/contributions/:id
// @access  Private
export const updateContribution = async (req, res) => {
  try {
    let contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    // Check if contribution belongs to user's household
    if (contribution.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this contribution' });
    }

    // ✅ Allow all household members to edit contributions (collaborative household)
    const household = await Household.findById(req.user.household);
    const isMember = household.isMember(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only household members can update contributions'
      });
    }

    // Track who modified
    req.body.lastModifiedBy = req.user.id;

    contribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email')
     .populate('household', 'name');

    res.status(200).json({
      success: true,
      message: 'Contribution updated successfully',
      data: contribution,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update contribution', error: error.message });
  }
};

// @desc    Delete contribution
// @route   DELETE /api/contributions/:id
// @access  Private
export const deleteContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    // Check if contribution belongs to user's household
    if (contribution.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this contribution' });
    }

    // ✅ Allow all household members to delete contributions (collaborative household)
    const household = await Household.findById(req.user.household);
    const isMember = household.isMember(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only household members can delete contributions'
      });
    }

    await contribution.deleteOne();
    res.status(200).json({ success: true, message: 'Contribution deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete contribution', error: error.message });
  }
};

// @desc    Get contribution statistics
// @route   GET /api/contributions/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const contributions = await Contribution.find({ household: req.user.household });

    const stats = {
      total: contributions.reduce((sum, c) => sum + c.amount, 0),
      count: contributions.length,
      byCategory: {},
      byPaymentMethod: {},
      thisMonth: 0,
      lastMonth: 0,
    };

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    contributions.forEach((c) => {
      stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + c.amount;
      stats.byPaymentMethod[c.paymentMethod] = (stats.byPaymentMethod[c.paymentMethod] || 0) + c.amount;

      const d = new Date(c.contributionDate);
      if (d >= thisMonthStart) stats.thisMonth += c.amount;
      else if (d >= lastMonthStart && d <= lastMonthEnd) stats.lastMonth += c.amount;
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics', error: error.message });
  }
};
