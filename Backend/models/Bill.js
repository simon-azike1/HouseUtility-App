// models/Bill.js
import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
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
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
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
  reminderDays: {
    type: Number,
    default: 3, // Remind 3 days before due date
    min: [0, 'Reminder days cannot be negative']
  },
  lastPaidDate: {
    type: Date
  },
  paymentHistory: [{
    paidDate: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    reference: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
billSchema.index({ user: 1, dueDate: 1 });
billSchema.index({ status: 1 });
billSchema.index({ isRecurring: 1 });

// Virtual for checking if bill is overdue
billSchema.virtual('isOverdue').get(function() {
  if (this.status === 'paid') return false;
  return new Date() > this.dueDate;
});

// Method to mark bill as paid
billSchema.methods.markAsPaid = function(paymentReference) {
  this.status = 'paid';
  this.lastPaidDate = new Date();
  this.paymentHistory.push({
    paidDate: new Date(),
    amount: this.amount,
    reference: paymentReference || 'Manual payment'
  });
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
    paymentHistory: []
  };
};

// Update status to overdue if past due date
billSchema.pre('save', function(next) {
  if (this.status === 'pending' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

export default mongoose.model('Bill', billSchema);