import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  // ✅ NEW: Link expense to household
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
    required: [true, 'Title is required'],
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
    enum: [
      'utilities',
      'groceries',
      'maintenance',
      'cleaning',
      'internet',
      'entertainment',
      'transportation',
      'other'
    ],
    default: 'other'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  expenseDate: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: String,
    required: [true, 'Paid by is required']
  },
  receipt: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  // ✅ NEW: Split information (for shared expenses)
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage', 'none'],
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
    }
  }],
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  // ✅ NEW: Track who created/modified
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

// ✅ UPDATED: Index by household first, then date
expenseSchema.index({ household: 1, expenseDate: -1 });
expenseSchema.index({ household: 1, category: 1 });
expenseSchema.index({ household: 1, user: 1 });

// Update timestamp on save
expenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

expenseSchema.virtual('formattedAmount').get(function () {
  return `$${this.amount.toFixed(2)}`;
});

// ✅ NEW: Calculate split amounts automatically for equal split
expenseSchema.methods.calculateEqualSplit = function(memberIds) {
  const splitAmount = this.amount / memberIds.length;
  this.splitDetails = memberIds.map(userId => ({
    user: userId,
    amount: splitAmount,
    percentage: 100 / memberIds.length,
    paid: userId.toString() === this.user.toString() // Mark paid if they're the payer
  }));
  return this;
};

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;