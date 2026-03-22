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
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 AI CATEGORIZATION STARTED');
  console.log('Description:', description);
  console.log('Amount:', amount);
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key (first 20 chars):', process.env.OPENAI_API_KEY?.substring(0, 20));
  
  try {
    const prompt = `You are a financial categorization assistant. Categorize the following expense into one of these categories:

${EXPENSE_CATEGORIES.join(', ')}

Expense description: "${description}"
${amount ? `Amount: $${amount}` : ''}

Respond with ONLY the category name, nothing else.`;

    console.log('📤 Sending request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      temperature: 0.3,
      max_tokens: 20,
    });

    console.log('📥 Received response from OpenAI');
    console.log('Full response:', JSON.stringify(completion, null, 2));
    
    const category = completion.choices[0].message.content.trim();
    console.log('✅ Extracted category:', category);

    // Validate that the response is one of our categories
    if (EXPENSE_CATEGORIES.includes(category)) {
      console.log('✅ Category is valid!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return category;
    }

    // Fallback if AI returns something unexpected
    console.warn('⚠️ AI returned unexpected category:', category);
    console.warn('Expected one of:', EXPENSE_CATEGORIES);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return 'Other';

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ AI CATEGORIZATION ERROR');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
    }
    console.error('Full error:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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