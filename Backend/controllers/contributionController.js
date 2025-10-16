// controllers/contributionController.js
const Contribution = require('../models/Contribution');

// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Private
exports.getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ contributionDate: -1 });

    // Calculate total
    const total = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);

    res.status(200).json({
      success: true,
      count: contributions.length,
      total: total,
      data: contributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contributions',
      error: error.message
    });
  }
};

// @desc    Get single contribution
// @route   GET /api/contributions/:id
// @access  Private
exports.getContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('user', 'name email');

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if contribution belongs to user
    if (contribution.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contribution'
      });
    }

    res.status(200).json({
      success: true,
      data: contribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contribution',
      error: error.message
    });
  }
};

// @desc    Create new contribution
// @route   POST /api/contributions
// @access  Private
exports.createContribution = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const contribution = await Contribution.create(req.body);

    // Populate user data
    await contribution.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Contribution created successfully',
      data: contribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create contribution',
      error: error.message
    });
  }
};

// @desc    Update contribution
// @route   PUT /api/contributions/:id
// @access  Private
exports.updateContribution = async (req, res) => {
  try {
    let contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if contribution belongs to user
    if (contribution.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this contribution'
      });
    }

    contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Contribution updated successfully',
      data: contribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update contribution',
      error: error.message
    });
  }
};

// @desc    Delete contribution
// @route   DELETE /api/contributions/:id
// @access  Private
exports.deleteContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if contribution belongs to user
    if (contribution.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this contribution'
      });
    }

    await contribution.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contribution deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contribution',
      error: error.message
    });
  }
};

// @desc    Get contribution statistics
// @route   GET /api/contributions/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const contributions = await Contribution.find({ user: req.user.id });

    const stats = {
      total: contributions.reduce((sum, contrib) => sum + contrib.amount, 0),
      count: contributions.length,
      byCategory: {},
      byPaymentMethod: {},
      thisMonth: 0,
      lastMonth: 0
    };

    // Calculate by category
    contributions.forEach(contrib => {
      stats.byCategory[contrib.category] = (stats.byCategory[contrib.category] || 0) + contrib.amount;
      stats.byPaymentMethod[contrib.paymentMethod] = (stats.byPaymentMethod[contrib.paymentMethod] || 0) + contrib.amount;
    });

    // Calculate this month and last month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    contributions.forEach(contrib => {
      const contribDate = new Date(contrib.contributionDate);
      if (contribDate >= thisMonthStart) {
        stats.thisMonth += contrib.amount;
      } else if (contribDate >= lastMonthStart && contribDate <= lastMonthEnd) {
        stats.lastMonth += contrib.amount;
      }
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};