// Script to add household to existing users
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate unique invite code
const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const fixHouseholds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users without a household
    const usersWithoutHousehold = await User.find({ household: null });
    console.log(`Found ${usersWithoutHousehold.length} users without a household`);

    for (const user of usersWithoutHousehold) {
      console.log(`\nProcessing user: ${user.name} (${user.email})`);

      // Create household
      const household = await Household.create({
        name: `${user.name}'s Household`,
        owner: user._id,
        inviteCode: generateInviteCode(),
        members: [{
          user: user._id,
          role: 'owner',
          joinedAt: new Date()
        }]
      });

      console.log(`  ✅ Created household: ${household.name}`);
      console.log(`  📋 Invite code: ${household.inviteCode}`);

      // Update user
      user.household = household._id;
      user.householdRole = 'owner';
      await user.save();

      console.log(`  ✅ Updated user with household`);
    }

    console.log('\n✅ All done! All users now have households.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixHouseholds();
