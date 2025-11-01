// routes/expenses.js
import express from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getStats
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.route('/stats').get(getStats);
router.route('/')
  .get(getExpenses)
  .post(createExpense);
router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
