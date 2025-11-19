import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
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
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contributionSchema.index({ user: 1, contributionDate: -1 });

contributionSchema.virtual('formattedAmount').get(function () {
  return `$${this.amount.toFixed(2)}`;
});

const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;
