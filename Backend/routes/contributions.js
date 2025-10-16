// routes/contributions.js
const express = require('express');
const router = express.Router();
const {
  getContributions,
  getContribution,
  createContribution,
  updateContribution,
  deleteContribution,
  getStats
} = require('../controllers/contributionController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/stats').get(getStats);
router.route('/').get(getContributions).post(createContribution);
router.route('/:id').get(getContribution).put(updateContribution).delete(deleteContribution);

module.exports = router;