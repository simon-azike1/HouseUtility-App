// Create household for user who doesn't have one
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const createHouseholdForUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user
    const user = await User.findOne({ email: 'simonazike155@gmail.com' });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`User ID: ${user._id}`);
    console.log(`Current household: ${user.household || 'NONE'}\n`);

    if (user.household) {
      console.log('⚠️ User already has a household');
      process.exit(0);
    }

    // Generate invite code
    const generateInviteCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Create household
    const inviteCode = generateInviteCode();
    const household = await Household.create({
      name: `${user.name}'s Household`,
      owner: user._id,
      inviteCode: inviteCode,
      members: [{
        user: user._id,
        role: 'owner',
        joinedAt: new Date()
      }]
    });

    console.log(`✅ Created household: ${household.name}`);
    console.log(`   Household ID: ${household._id}`);
    console.log(`   Invite Code: ${household.inviteCode}\n`);

    // Update user
    user.household = household._id;
    user.householdRole = 'owner';
    await user.save();

    console.log(`✅ Updated user with household reference`);
    console.log(`   Household ID: ${user.household}`);
    console.log(`   Role: ${user.householdRole}\n`);

    console.log('✅ Done! User now has a household.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createHouseholdForUser();
