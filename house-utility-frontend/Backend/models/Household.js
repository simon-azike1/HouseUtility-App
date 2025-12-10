import mongoose from 'mongoose';

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'My Household' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode: { type: String, unique: true, required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  // ✅ NEW: Useful metadata
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique invite code
householdSchema.methods.generateInviteCode = function() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ✅ NEW: Check if user is owner or admin
householdSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member && (member.role === 'owner' || member.role === 'admin');
};

// ✅ NEW: Check if user is a member
householdSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString());
};

// ✅ NEW: Add member to household
householdSchema.methods.addMember = function(userId, role = 'member') {
  if (this.isMember(userId)) {
    throw new Error('User is already a member of this household');
  }
  this.members.push({ user: userId, role });
  return this.save();
};

// ✅ NEW: Remove member from household
householdSchema.methods.removeMember = function(userId) {
  console.log('🔍 Before removal - Members count:', this.members.length);
  console.log('🔍 Removing user:', userId.toString());

  const initialLength = this.members.length;
  this.members = this.members.filter(m => {
    const memberUserId = m.user.toString();
    const shouldKeep = memberUserId !== userId.toString();
    console.log(`  Member ${memberUserId}: ${shouldKeep ? 'KEEP' : 'REMOVE'}`);
    return shouldKeep;
  });

  console.log('🔍 After removal - Members count:', this.members.length);
  console.log('🔍 Members removed:', initialLength - this.members.length);

  return this.save();
};

// Update timestamp on save
householdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ✅ CASCADE DELETION: When a household is deleted, clean up related data
householdSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    console.log(`🗑️ Cascading deletion for household: ${this.name}`);

    const User = mongoose.model('User');
    const Expense = mongoose.model('Expense');
    const Bill = mongoose.model('Bill');
    const Contribution = mongoose.model('Contribution');

    // Remove household reference from all members (but keep the users)
    const membersUpdated = await User.updateMany(
      { household: this._id },
      { $set: { household: null, householdRole: null } }
    );
    console.log(`👥 Cleared household reference for ${membersUpdated.modifiedCount} members`);

    // Delete all household expenses
    const expensesDeleted = await Expense.deleteMany({ household: this._id });
    console.log(`💰 Deleted ${expensesDeleted.deletedCount} expenses`);

    // Delete all household bills
    const billsDeleted = await Bill.deleteMany({ household: this._id });
    console.log(`📄 Deleted ${billsDeleted.deletedCount} bills`);

    // Delete all household contributions
    const contributionsDeleted = await Contribution.deleteMany({ household: this._id });
    console.log(`💵 Deleted ${contributionsDeleted.deletedCount} contributions`);

    console.log(`✅ Cascade deletion complete for household: ${this.name}`);
    next();
  } catch (error) {
    console.error(`❌ Error in household cascade deletion:`, error);
    next(error);
  }
});

householdSchema.pre('findOneAndDelete', async function(next) {
  try {
    const household = await this.model.findOne(this.getQuery());
    if (!household) {
      return next();
    }

    console.log(`🗑️ Cascading deletion for household (findOneAndDelete): ${household.name}`);

    const User = mongoose.model('User');
    const Expense = mongoose.model('Expense');
    const Bill = mongoose.model('Bill');
    const Contribution = mongoose.model('Contribution');

    const membersUpdated = await User.updateMany(
      { household: household._id },
      { $set: { household: null, householdRole: null } }
    );
    console.log(`👥 Cleared household reference for ${membersUpdated.modifiedCount} members`);

    const expensesDeleted = await Expense.deleteMany({ household: household._id });
    console.log(`💰 Deleted ${expensesDeleted.deletedCount} expenses`);

    const billsDeleted = await Bill.deleteMany({ household: household._id });
    console.log(`📄 Deleted ${billsDeleted.deletedCount} bills`);

    const contributionsDeleted = await Contribution.deleteMany({ household: household._id });
    console.log(`💵 Deleted ${contributionsDeleted.deletedCount} contributions`);

    console.log(`✅ Cascade deletion complete for household: ${household.name}`);
    next();
  } catch (error) {
    console.error(`❌ Error in household cascade deletion:`, error);
    next(error);
  }
});

householdSchema.pre('deleteMany', async function(next) {
  try {
    const households = await this.model.find(this.getQuery());
    const householdIds = households.map(h => h._id);

    if (householdIds.length === 0) {
      return next();
    }

    console.log(`🗑️ Cascading deletion for ${households.length} households`);

    const User = mongoose.model('User');
    const Expense = mongoose.model('Expense');
    const Bill = mongoose.model('Bill');
    const Contribution = mongoose.model('Contribution');

    const membersUpdated = await User.updateMany(
      { household: { $in: householdIds } },
      { $set: { household: null, householdRole: null } }
    );
    console.log(`👥 Cleared household reference for ${membersUpdated.modifiedCount} members`);

    const expensesDeleted = await Expense.deleteMany({ household: { $in: householdIds } });
    console.log(`💰 Deleted ${expensesDeleted.deletedCount} expenses`);

    const billsDeleted = await Bill.deleteMany({ household: { $in: householdIds } });
    console.log(`📄 Deleted ${billsDeleted.deletedCount} bills`);

    const contributionsDeleted = await Contribution.deleteMany({ household: { $in: householdIds } });
    console.log(`💵 Deleted ${contributionsDeleted.deletedCount} contributions`);

    console.log(`✅ Cascade deletion complete for ${households.length} households`);
    next();
  } catch (error) {
    console.error(`❌ Error in household cascade deletion:`, error);
    next(error);
  }
});

const Household = mongoose.model('Household', householdSchema);
export default Household;