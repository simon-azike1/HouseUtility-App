// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // ✅ HOUSEHOLD LINK
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    default: null
  },
  // ✅ NEW: Role within household (separate from system role)
  householdRole: {
    type: String,
    enum: ['owner', 'admin', 'member', 'viewer', null],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: null
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Update timestamp
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ NEW: Check if user has a household
userSchema.methods.hasHousehold = function() {
  return this.household !== null && this.household !== undefined;
};

// ✅ NEW: Check if user is household admin
userSchema.methods.isHouseholdAdmin = function() {
  return this.householdRole === 'owner' || this.householdRole === 'admin';
};

// ✅ CASCADE DELETION: When a user is deleted, clean up their data
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    console.log(`🗑️ Cascading deletion for user: ${this.email}`);

    const Household = mongoose.model('Household');
    const Expense = mongoose.model('Expense');
    const Bill = mongoose.model('Bill');
    const Contribution = mongoose.model('Contribution');

    // Delete all households where this user is the owner
    const ownedHouseholds = await Household.find({ owner: this._id });
    console.log(`📊 Found ${ownedHouseholds.length} households owned by user`);

    for (const household of ownedHouseholds) {
      console.log(`🏠 Deleting household: ${household.name}`);
      await household.deleteOne(); // This triggers the household's pre-delete hook
    }

    // Delete all expenses created by this user
    const expensesDeleted = await Expense.deleteMany({ createdBy: this._id });
    console.log(`💰 Deleted ${expensesDeleted.deletedCount} expenses`);

    // Delete all bills created by this user
    const billsDeleted = await Bill.deleteMany({ createdBy: this._id });
    console.log(`📄 Deleted ${billsDeleted.deletedCount} bills`);

    // Delete all contributions by this user
    const contributionsDeleted = await Contribution.deleteMany({ user: this._id });
    console.log(`💵 Deleted ${contributionsDeleted.deletedCount} contributions`);

    console.log(`✅ Cascade deletion complete for user: ${this.email}`);
    next();
  } catch (error) {
    console.error(`❌ Error in user cascade deletion:`, error);
    next(error);
  }
});

userSchema.pre('findOneAndDelete', async function(next) {
  try {
    const user = await this.model.findOne(this.getQuery());
    if (!user) {
      return next();
    }

    console.log(`🗑️ Cascading deletion for user (findOneAndDelete): ${user.email}`);

    const Household = mongoose.model('Household');
    const Expense = mongoose.model('Expense');
    const Bill = mongoose.model('Bill');
    const Contribution = mongoose.model('Contribution');

    // Delete all households where this user is the owner
    const ownedHouseholds = await Household.find({ owner: user._id });
    console.log(`📊 Found ${ownedHouseholds.length} households owned by user`);

    for (const household of ownedHouseholds) {
      console.log(`🏠 Deleting household: ${household.name}`);
      await household.deleteOne();
    }

    const expensesDeleted = await Expense.deleteMany({ createdBy: user._id });
    console.log(`💰 Deleted ${expensesDeleted.deletedCount} expenses`);

    const billsDeleted = await Bill.deleteMany({ createdBy: user._id });
    console.log(`📄 Deleted ${billsDeleted.deletedCount} bills`);

    const contributionsDeleted = await Contribution.deleteMany({ user: user._id });
    console.log(`💵 Deleted ${contributionsDeleted.deletedCount} contributions`);

    console.log(`✅ Cascade deletion complete for user: ${user.email}`);
    next();
  } catch (error) {
    console.error(`❌ Error in user cascade deletion:`, error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
export default User;