import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
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
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

expenseSchema.index({ user: 1, expenseDate: -1 });
expenseSchema.index({ category: 1 });

expenseSchema.virtual('formattedAmount').get(function () {
  return `$${this.amount.toFixed(2)}`;
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
