// routes/expenses.js
const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/stats').get(getStats);
router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;