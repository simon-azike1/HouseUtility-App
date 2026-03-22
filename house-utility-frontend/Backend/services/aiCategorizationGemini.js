import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EXPENSE_CATEGORIES = [
  'Food & Groceries',
  'Dining Out',
  'Transportation',
  'Utilities',
  'Rent/Mortgage',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Insurance',
  'Subscriptions',
  'Travel',
  'Personal Care',
  'Household Items',
  'Gifts & Donations',
  'Other'
];

/**
 * Categorize an expense using Google Gemini AI
 * @param {string} description - The expense description
 * @param {number} amount - The expense amount (optional)
 * @returns {Promise<string>} - The predicted category
 */
export const categorizeExpense = async (description, amount = null) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 GEMINI AI CATEGORIZATION STARTED');
  console.log('Description:', description);
  console.log('Amount:', amount);
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key (first 20 chars):', process.env.GEMINI_API_KEY?.substring(0, 20));
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a financial categorization assistant. Categorize the following expense into one of these categories ONLY:

${EXPENSE_CATEGORIES.join(', ')}

Expense description: "${description}"
${amount ? `Amount: $${amount}` : ''}

Rules:
- You MUST respond with ONLY one category name from the list above
- Do not add any explanation, punctuation, or extra text
- The category name must match exactly as written in the list

Category:`;

    console.log('📤 Sending request to Gemini...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();
    
    console.log('📥 Received response from Gemini');
    console.log('Raw response:', category);
    
    // Validate that the response is one of our categories
    if (EXPENSE_CATEGORIES.includes(category)) {
      console.log('✅ Valid category:', category);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return category;
    }
    
    // Fallback if Gemini returns something unexpected
    console.warn('⚠️ Gemini returned unexpected category:', category);
    console.warn('Expected one of:', EXPENSE_CATEGORIES);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return 'Other';
    
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ GEMINI AI ERROR');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return 'Other';
  }
};

/**
 * Categorize multiple expenses in batch
 * @param {Array} expenses - Array of {description, amount}
 * @returns {Promise<Array>} - Array of predicted categories
 */
export const categorizeExpensesBatch = async (expenses) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const expensesList = expenses.map((exp, idx) => 
      `${idx + 1}. "${exp.description}"${exp.amount ? ` ($${exp.amount})` : ''}`
    ).join('\n');

    const prompt = `Categorize these expenses into one of these categories:
${EXPENSE_CATEGORIES.join(', ')}

Expenses:
${expensesList}

Respond with only the category names, one per line, in the same order.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const categories = response.text()
      .trim()
      .split('\n')
      .map(cat => cat.trim())
      .filter(cat => EXPENSE_CATEGORIES.includes(cat));

    return categories;
    
  } catch (error) {
    console.error('❌ Batch Gemini Error:', error.message);
    return expenses.map(() => 'Other');
  }
};

export default {
  categorizeExpense,
  categorizeExpensesBatch,
  EXPENSE_CATEGORIES
};