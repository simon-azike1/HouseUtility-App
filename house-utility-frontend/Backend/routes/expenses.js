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
import { categorizeExpense } from '../services/aiCategorization.js'; // ✅ IMPORT

const router = express.Router();

// Protect all routes
router.use(protect);


// Protect all routes
router.use(protect);

// ✅ SUPER SIMPLE TEST - Add this at the top
router.get('/test-simple', async (req, res) => {
  console.log('═══════════════════════════════════════');
  console.log('🧪 SIMPLE TEST ROUTE HIT!');
  console.log('═══════════════════════════════════════');
  res.json({ message: 'Test route works!' });
});

// ✅ AI CATEGORIZATION ROUTE - MUST BE BEFORE /:id
router.post('/categorize', async (req, res) => {
  try {
    console.log('🎯 /categorize route hit!'); // ✅ ADD THIS LOG
    console.log('Request body:', req.body);
    
    const { description, amount } = req.body;

    if (!description) {
      return res.status(400).json({ 
        success: false,
        message: 'Description is required' 
      });
    }

    console.log('📞 Calling categorizeExpense function...'); // ✅ ADD THIS LOG
    
    // Get AI suggestion
    const suggestedCategory = await categorizeExpense(description, amount);

    console.log('✅ Got response from categorizeExpense:', suggestedCategory); // ✅ ADD THIS LOG

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

// TEST ENDPOINT - can remove later
router.get('/test-ai', protect, async (req, res) => {
  const fs = await import('fs');
  const path = await import('path');
  
  const filePath = path.join(process.cwd(), 'services', 'aiCategorization.js');
  const exists = fs.existsSync(filePath);
  
  res.json({
    fileExists: exists,
    cwd: process.cwd(),
    expectedPath: filePath,
    openaiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

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