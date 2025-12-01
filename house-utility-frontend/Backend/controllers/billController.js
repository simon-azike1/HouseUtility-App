// controllers/billController.js
import Bill from '../models/Bill.js';
import Household from '../models/Household.js';
import User from '../models/User.js';
import { notifyHousehold } from '../services/notificationService.js';

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
export const getBills = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const { status, category, isRecurring } = req.query;

    let query = { household: req.user.household };

    // Filter by status
    if (status) query.status = status;

    // Filter by category
    if (category) query.category = category;

    // Filter by recurring
    if (isRecurring) query.isRecurring = isRecurring === 'true';

    const bills = await Bill.find(query)
      .populate('user', 'name email')
      .populate('household', 'name')
      .sort({ dueDate: 1 });

    // Calculate totals
    const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const pending = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
    const overdue = bills.filter(b => b.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0);
    const paid = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

    res.status(200).json({
      success: true,
      count: bills.length,
      totals: { total, pending, overdue, paid },
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: error.message
    });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
export const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('user', 'name email')
      .populate('household', 'name');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check if bill belongs to user's household
    if (bill.household._id.toString() !== req.user.household.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this bill'
      });
    }

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill',
      error: error.message
    });
  }
};

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private
export const createBill = async (req, res) => {
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

    const bill = await Bill.create(req.body);

    // Populate user and household data
    await bill.populate('user', 'name email');
    await bill.populate('household', 'name');

    // Send notification to household members
    try {
      const dueDate = new Date(bill.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await notifyHousehold(req.user.household, 'billReminder', {
        title: bill.title,
        amount: bill.amount,
        currency: bill.currency || 'MAD',
        dueDate: dueDate,
        category: bill.category,
        relatedTo: {
          type: 'bill',
          id: bill._id
        }
      });
    } catch (notificationError) {
      console.error('Failed to send bill notification:', notificationError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create bill',
      error: error.message
    });
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
export const updateBill = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check if bill belongs to user's household
    if (bill.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bill'
      });
    }

    // ✅ Allow all household members to edit bills (collaborative household)
    const household = await Household.findById(req.user.household);
    const isMember = household.isMember(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only household members can update bills'
      });
    }

    // Track who modified
    req.body.lastModifiedBy = req.user.id;

    bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('household', 'name');

    res.status(200).json({
      success: true,
      message: 'Bill updated successfully',
      data: bill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update bill',
      error: error.message
    });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check if bill belongs to user's household
    if (bill.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bill'
      });
    }

    // ✅ Allow all household members to delete bills (collaborative household)
    const household = await Household.findById(req.user.household);
    const isMember = household.isMember(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only household members can delete bills'
      });
    }

    await bill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete bill',
      error: error.message
    });
  }
};

// @desc    Mark bill as paid
// @route   POST /api/bills/:id/pay
// @access  Private
export const markBillAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check if bill belongs to user's household
    if (bill.household.toString() !== req.user.household.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bill'
      });
    }

    const { paymentReference, paymentMethod } = req.body;
    await bill.markAsPaid(req.user.id, paymentReference, paymentMethod);

    // If recurring, create next bill
    if (bill.isRecurring) {
      const nextBillData = bill.generateNextBill();
      if (nextBillData) {
        await Bill.create(nextBillData);
      }
    }

    await bill.populate('user', 'name email');
    await bill.populate('household', 'name');

    res.status(200).json({
      success: true,
      message: 'Bill marked as paid successfully',
      data: bill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to mark bill as paid',
      error: error.message
    });
  }
};

// @desc    Get upcoming bills (due within next 7 days)
// @route   GET /api/bills/upcoming
// @access  Private
export const getUpcomingBills = async (req, res) => {
  try {
    // Check if user has a household
    if (!req.user.household) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to any household'
      });
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const bills = await Bill.find({
      household: req.user.household,
      status: { $in: ['pending', 'overdue'] },
      dueDate: { $gte: today, $lte: nextWeek }
    })
      .populate('user', 'name email')
      .populate('household', 'name')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming bills',
      error: error.message
    });
  }
};

// @desc    Get bill statistics
// @route   GET /api/bills/stats
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

    const bills = await Bill.find({ household: req.user.household });

    const stats = {
      total: bills.reduce((sum, bill) => sum + bill.amount, 0),
      count: bills.length,
      pending: bills.filter(b => b.status === 'pending').length,
      pendingAmount: bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0),
      overdue: bills.filter(b => b.status === 'overdue').length,
      overdueAmount: bills.filter(b => b.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0),
      paid: bills.filter(b => b.status === 'paid').length,
      paidAmount: bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0),
      recurring: bills.filter(b => b.isRecurring).length,
      byCategory: {},
      thisMonth: 0,
      nextMonth: 0
    };

    // Calculate by category
    bills.forEach(bill => {
      stats.byCategory[bill.category] = (stats.byCategory[bill.category] || 0) + bill.amount;
    });

    // Calculate this month and next month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    bills.forEach(bill => {
      const billDate = new Date(bill.dueDate);
      if (billDate >= thisMonthStart && billDate < nextMonthStart) {
        stats.thisMonth += bill.amount;
      } else if (billDate >= nextMonthStart && billDate <= nextMonthEnd) {
        stats.nextMonth += bill.amount;
      }
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};