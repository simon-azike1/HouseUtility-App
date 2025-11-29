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
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

// Update timestamp on save
householdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Household = mongoose.model('Household', householdSchema);
export default Household;