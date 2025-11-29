import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  // ✅ NEW: Link contribution to household
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['rent', 'utilities', 'groceries', 'maintenance', 'internet', 'other'],
    default: 'other'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'card', 'other'],
    default: 'cash'
  },
  contributionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'confirmed'
  },
  // ✅ NEW: Link to expense if this contribution is for a specific expense
  relatedExpense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    default: null
  },
  // ✅ NEW: Settlement information (who this payment is to)
  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  // ✅ NEW: Receipt/proof of payment
  receipt: {
    type: String,
    default: null
  },
  // ✅ NEW: Track who approved/rejected
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
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
contributionSchema.index({ household: 1, contributionDate: -1 });
contributionSchema.index({ household: 1, user: 1 });
contributionSchema.index({ household: 1, status: 1 });
contributionSchema.index({ relatedExpense: 1 });

// Update timestamp on save
contributionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

contributionSchema.virtual('formattedAmount').get(function () {
  return `$${this.amount.toFixed(2)}`;
});

// ✅ NEW: Approve contribution
contributionSchema.methods.approve = function(adminUserId) {
  this.status = 'confirmed';
  this.reviewedBy = adminUserId;
  this.reviewedAt = Date.now();
  return this.save();
};

// ✅ NEW: Reject contribution
contributionSchema.methods.reject = function(adminUserId) {
  this.status = 'rejected';
  this.reviewedBy = adminUserId;
  this.reviewedAt = Date.now();
  return this.save();
};

const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;