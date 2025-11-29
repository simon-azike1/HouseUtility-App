// models/Bill.js
import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  // ✅ NEW: Link bill to household
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: [true, 'Household is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Bill title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    enum: ['rent', 'electricity', 'water', 'gas', 'internet', 'phone', 'insurance', 'subscription', 'other'],
    default: 'other'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled', 'partially_paid'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'card', 'auto_debit', 'other'],
    default: 'bank_transfer'
  },
  vendor: {
    type: String,
    trim: true,
    maxlength: [100, 'Vendor name cannot exceed 100 characters']
  },
  accountNumber: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  // ✅ NEW: Bill splitting among household members
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage', 'full'],
    default: 'equal'
  },
  splitDetails: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: {
      type: Date
    },
    paidAmount: {
      type: Number,
      default: 0
    }
  }],
  reminderDays: {
    type: Number,
    default: 3,
    min: [0, 'Reminder days cannot be negative']
  },
  lastPaidDate: {
    type: Date
  },
  // ✅ ENHANCED: More detailed payment history
  paymentHistory: [{
    paidDate: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reference: String,
    paymentMethod: String
  }],
  // ✅ NEW: Attachment support
  attachments: [{
    url: String,
    name: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // ✅ NEW: Audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ UPDATED: Index by household first
billSchema.index({ household: 1, dueDate: 1 });
billSchema.index({ household: 1, status: 1 });
billSchema.index({ household: 1, isRecurring: 1 });
billSchema.index({ household: 1, category: 1 });

// Update timestamp on save
billSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update status to overdue if past due date
  if (this.status === 'pending' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  
  next();
});

// Virtual for checking if bill is overdue
billSchema.virtual('isOverdue').get(function() {
  if (this.status === 'paid') return false;
  return new Date() > this.dueDate;
});

// ✅ NEW: Calculate total paid amount
billSchema.virtual('totalPaid').get(function() {
  return this.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
});

// ✅ NEW: Calculate remaining amount
billSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.totalPaid;
});

// ✅ ENHANCED: Mark bill as paid (with user tracking)
billSchema.methods.markAsPaid = function(userId, paymentReference, paymentMethod) {
  this.status = 'paid';
  this.lastPaidDate = new Date();
  this.paymentHistory.push({
    paidDate: new Date(),
    amount: this.amount,
    paidBy: userId,
    reference: paymentReference || 'Manual payment',
    paymentMethod: paymentMethod || this.paymentMethod
  });
  
  // Mark all splits as paid
  this.splitDetails.forEach(split => {
    split.paid = true;
    split.paidDate = new Date();
    split.paidAmount = split.amount;
  });
  
  return this.save();
};

// ✅ NEW: Record partial payment
billSchema.methods.recordPayment = function(userId, amount, reference, paymentMethod) {
  const totalPaid = this.totalPaid + amount;
  
  this.paymentHistory.push({
    paidDate: new Date(),
    amount: amount,
    paidBy: userId,
    reference: reference || 'Partial payment',
    paymentMethod: paymentMethod || this.paymentMethod
  });
  
  if (totalPaid >= this.amount) {
    this.status = 'paid';
    this.lastPaidDate = new Date();
  } else {
    this.status = 'partially_paid';
  }
  
  return this.save();
};

// ✅ NEW: Calculate equal split for all household members
billSchema.methods.calculateEqualSplit = function(memberIds) {
  const splitAmount = this.amount / memberIds.length;
  this.splitDetails = memberIds.map(userId => ({
    user: userId,
    amount: splitAmount,
    percentage: 100 / memberIds.length,
    paid: false,
    paidAmount: 0
  }));
  return this;
};

// ✅ NEW: Mark individual split as paid
billSchema.methods.markSplitPaid = function(userId, amount) {
  const split = this.splitDetails.find(s => s.user.toString() === userId.toString());
  if (!split) {
    throw new Error('User not found in split details');
  }
  
  split.paidAmount = (split.paidAmount || 0) + amount;
  
  if (split.paidAmount >= split.amount) {
    split.paid = true;
    split.paidDate = new Date();
  }
  
  // Check if all splits are paid
  const allPaid = this.splitDetails.every(s => s.paid);
  if (allPaid) {
    this.status = 'paid';
    this.lastPaidDate = new Date();
  } else {
    this.status = 'partially_paid';
  }
  
  return this.save();
};

// Method to generate next bill (for recurring bills)
billSchema.methods.generateNextBill = function() {
  if (!this.isRecurring) return null;

  const nextDueDate = new Date(this.dueDate);
  
  switch(this.recurringInterval) {
    case 'weekly':
      nextDueDate.setDate(nextDueDate.getDate() + 7);
      break;
    case 'monthly':
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      break;
  }

  return {
    ...this.toObject(),
    _id: undefined,
    dueDate: nextDueDate,
    status: 'pending',
    lastPaidDate: undefined,
    paymentHistory: [],
    // Reset split details to unpaid
    splitDetails: this.splitDetails.map(split => ({
      ...split,
      paid: false,
      paidDate: undefined,
      paidAmount: 0
    }))
  };
};

export default mongoose.model('Bill', billSchema);