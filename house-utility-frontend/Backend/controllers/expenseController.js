// controllers/expenseController.js
import Expense from '../models/Expense.js';
import Household from '../models/Household.js';
import User from '../models/User.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const { startDate, endDate, category, status } = req.query;
    let query = { household: req.user.household };

    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) query.expenseDate.$gte = new Date(startDate);
      if (endDate) query.expenseDate.$lte = new Date(endDate);
    }

    if (category) query.category = category;
    if (status) query.status = status;

    const expenses = await Expense.find(query)
      .populate('user', 'name email')
      .populate('household', 'name')
      .sort({ expenseDate: -1 });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('user', 'name email')
      .populate('household', 'name');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if expense belongs to user's household
    if (expense.household._id.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this expense' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expense', error: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    // Add user and household to req.body
    req.body.user = req.user.id;
    req.body.household = req.user.household;
    req.body.createdBy = req.user.id;

    const expense = await Expense.create(req.body);

    // Populate user and household data
    await expense.populate('user', 'name email');
    await expense.populate('household', 'name');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if expense belongs to user's household
    if (expense.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this expense' });
    }

    // Check if user is admin OR owner of the expense
    const household = await Household.findById(req.user.household);
    const isAdmin = household.isAdmin(req.user.id);
    const isOwner = expense.user.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own expenses, or be an admin'
      });
    }

    // Track who modified
    req.body.lastModifiedBy = req.user.id;

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email')
     .populate('household', 'name');

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if expense belongs to user's household
    if (expense.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    // Check if user is admin OR owner of the expense
    const household = await Household.findById(req.user.household);
    const isAdmin = household.isAdmin(req.user.id);
    const isOwner = expense.user.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own expenses, or be an admin'
      });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const expenses = await Expense.find({ household: req.user.household });

    const stats = {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      count: expenses.length,
      byCategory: {},
      byMonth: {},
      thisMonth: 0,
      lastMonth: 0,
      thisYear: 0,
    };

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.expenseDate);
      stats.byCategory[expense.category] = (stats.byCategory[expense.category] || 0) + expense.amount;

      if (expenseDate >= thisMonthStart) stats.thisMonth += expense.amount;
      else if (expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd) stats.lastMonth += expense.amount;
      if (expenseDate >= thisYearStart) stats.thisYear += expense.amount;

      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + expense.amount;
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};
