import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const ensureAdminEmail = (req, res) => {
  const normalizeEmail = (value) =>
    (value || '').toLowerCase().trim().replace(/^['"`]|['"`]$/g, '');
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  if (!adminEmail || normalizeEmail(req.user?.email) !== adminEmail) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return false;
  }
  return true;
};

// @desc    Admin metrics
// @route   GET /api/admin/metrics
// @access  Private (email-based)
export const getAdminMetrics = async (req, res) => {
  try {
    if (!ensureAdminEmail(req, res)) return;

    const [usersCount, feedbackCount] = await Promise.all([
      User.countDocuments(),
      Feedback.countDocuments()
    ]);

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const avgRatingAgg = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingAgg[0]?.avgRating || 0;

    const feedbackLast7 = await Feedback.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const feedbackPrev7 = await Feedback.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });

    const avgRatingLast7Agg = await Feedback.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRatingLast7 = avgRatingLast7Agg[0]?.avgRating || 0;

    const avgRatingPrev7Agg = await Feedback.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRatingPrev7 = avgRatingPrev7Agg[0]?.avgRating || 0;

    const usersLast7 = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const usersPrev7 = await User.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });

    const ratingBreakdown = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const feedbackOverTime = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const countryBreakdown = await Feedback.aggregate([
      { $group: { _id: { $ifNull: ['$country', 'Unknown'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name email')
      .lean();

    return res.json({
      success: true,
      data: {
        usersCount,
        feedbackCount,
        avgRating,
        feedbackLast7,
        feedbackPrev7,
        avgRatingLast7,
        avgRatingPrev7,
        usersLast7,
        usersPrev7,
        ratingBreakdown,
        feedbackOverTime,
        countryBreakdown,
        recentFeedback
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private (email-based)
export const deleteFeedback = async (req, res) => {
  try {
    if (!ensureAdminEmail(req, res)) return;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List feedback (for export)
// @route   GET /api/admin/feedback
// @access  Private (email-based)
export const listFeedback = async (req, res) => {
  try {
    if (!ensureAdminEmail(req, res)) return;

    const limit = Math.min(parseInt(req.query.limit || '500', 10), 2000);
    const skip = parseInt(req.query.skip || '0', 10);

    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .lean();

    return res.json({ success: true, data: feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List users (for export)
// @route   GET /api/admin/users
// @access  Private (email-based)
export const listUsers = async (req, res) => {
  try {
    if (!ensureAdminEmail(req, res)) return;

    const limit = Math.min(parseInt(req.query.limit || '2000', 10), 5000);
    const skip = parseInt(req.query.skip || '0', 10);

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name email country createdAt')
      .lean();

    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
