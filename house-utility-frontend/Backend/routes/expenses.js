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
import { categorizeExpense } from '../services/aiCategorization.js'; // ✅ ADD THIS

const router = express.Router();

// Protect all routes
router.use(protect);

// ✅ AI CATEGORIZATION ROUTE - MUST BE BEFORE /:id
router.post('/categorize', async (req, res) => {
  try {
    const { description, amount } = req.body;

    if (!description) {
      return res.status(400).json({ 
        success: false,
        message: 'Description is required' 
      });
    }

    // Get AI suggestion
    const suggestedCategory = await categorizeExpense(description, amount);

    res.json({
      success: true,
      suggestedCategory,
      description,
      amount
    });

  } catch (error) {
    console.error('❌ Categorization endpoint error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to categorize expense',
      error: error.message 
    });
  }
});
``
// Existing routes
router.route('/stats').get(getStats);
router.route('/')
  .get(getExpenses)
  .post(createExpense);
router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;