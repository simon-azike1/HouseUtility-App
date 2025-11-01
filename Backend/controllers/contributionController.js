// controllers/contributionController.js
import Contribution from '../models/Contribution.js';

// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Private
export const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ user: req.user.id })
      .populate('user', 'name email')
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
      .populate('user', 'name email');

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    if (contribution.user._id.toString() !== req.user.id) {
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
    req.body.user = req.user.id;
    const contribution = await Contribution.create(req.body);
    await contribution.populate('user', 'name email');

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

    if (contribution.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this contribution' });
    }

    contribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

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

    if (contribution.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this contribution' });
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
    const contributions = await Contribution.find({ user: req.user.id });

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
