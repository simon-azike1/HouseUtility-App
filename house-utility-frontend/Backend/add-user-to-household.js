// Add specific user to household
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const addUserToHousehold = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the user to add
    const userEmail = 'azikeshinye@gmail.com';
    const inviteCode = 'UHPNG3XL';

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`❌ User not found: ${userEmail}`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`User ID: ${user._id}`);
    console.log(`Current household: ${user.household || 'NONE'}\n`);

    // Find household by invite code
    const household = await Household.findOne({ inviteCode });
    if (!household) {
      console.log(`❌ Household not found with code: ${inviteCode}`);
      process.exit(1);
    }

    console.log(`Found household: ${household.name}`);
    console.log(`Household ID: ${household._id}\n`);

    // Check if user already in household
    if (user.household && user.household.toString() === household._id.toString()) {
      console.log('✅ User already belongs to this household');
      process.exit(0);
    }

    // Check if user is already in members array
    const isMember = household.members.some(m => m.user.toString() === user._id.toString());

    if (!isMember) {
      // Add to members array
      console.log('➕ Adding user to household members array...');
      household.members.push({
        user: user._id,
        role: 'member',
        joinedAt: new Date()
      });
      await household.save();
      console.log('✅ Added to members array');
    } else {
      console.log('ℹ️  User already in members array');
    }

    // Update user document
    console.log('🔗 Linking household to user...');
    user.household = household._id;
    user.householdRole = 'member';
    await user.save();

    console.log('✅ Done! User successfully added to household.');
    console.log(`   User: ${user.email}`);
    console.log(`   Household: ${household.name}`);
    console.log(`   Role: member`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addUserToHousehold();
