import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Predefined expense categories
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
 * Categorize an expense using AI
 * @param {string} description - The expense description
 * @param {number} amount - The expense amount (optional, helps with context)
 * @returns {Promise<string>} - The predicted category
 */
export const categorizeExpense = async (description, amount = null) => {
  try {
    console.log('🤖 AI categorizing:', description);

    const prompt = `You are a financial categorization assistant. Categorize the following expense into one of these categories:

${EXPENSE_CATEGORIES.join(', ')}

Expense description: "${description}"
${amount ? `Amount: $${amount}` : ''}

Respond with ONLY the category name, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-4 for better accuracy but higher cost
      messages: [
        {
          role: "system",
          content: "You are a helpful financial assistant that categorizes expenses accurately. Always respond with only the category name from the provided list."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 20,
    });

    const category = completion.choices[0].message.content.trim();

    // Validate that the response is one of our categories
    if (EXPENSE_CATEGORIES.includes(category)) {
      console.log('✅ AI suggested:', category);
      return category;
    }

    // Fallback if AI returns something unexpected
    console.warn('⚠️ AI returned unexpected category:', category);
    return 'Other';

  } catch (error) {
    console.error('❌ AI Categorization Error:', error.message);
    // Fallback to 'Other' if AI fails
    return 'Other';
  }
};

/**
 * Categorize multiple expenses in batch (more cost-efficient)
 * @param {Array} expenses - Array of {description, amount}
 * @returns {Promise<Array>} - Array of predicted categories
 */
export const categorizeExpensesBatch = async (expenses) => {
  try {
    const expensesList = expenses.map((exp, idx) => 
      `${idx + 1}. "${exp.description}"${exp.amount ? ` ($${exp.amount})` : ''}`
    ).join('\n');

    const prompt = `Categorize these expenses into one of these categories:
${EXPENSE_CATEGORIES.join(', ')}

Expenses:
${expensesList}

Respond with only the category names, one per line, in the same order.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial assistant. Categorize each expense and respond with only category names, one per line."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const categories = completion.choices[0].message.content
      .trim()
      .split('\n')
      .map(cat => cat.trim())
      .filter(cat => EXPENSE_CATEGORIES.includes(cat));

    return categories;

  } catch (error) {
    console.error('❌ Batch AI Categorization Error:', error.message);
    return expenses.map(() => 'Other');
  }
};

export default {
  categorizeExpense,
  categorizeExpensesBatch,
  EXPENSE_CATEGORIES
};