// Quick script to check all users and households in database
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find().select('-password');
    console.log('👥 USERS:');
    console.log(`Total users: ${users.length}\n`);
    users.forEach(user => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Verified: ${user.isVerified}`);
      console.log(`   Household ID: ${user.household || 'NONE'}`);
      console.log(`   Household Role: ${user.householdRole || 'NONE'}`);
      console.log('');
    });

    // Get all households
    const households = await Household.find().populate('members.user', 'name email');
    console.log('\n🏠 HOUSEHOLDS:');
    console.log(`Total households: ${households.length}\n`);
    households.forEach(household => {
      console.log(`🏠 Name: ${household.name}`);
      console.log(`   Invite Code: ${household.inviteCode}`);
      console.log(`   Owner: ${household.owner}`);
      console.log(`   Members (${household.members.length}):`);
      household.members.forEach(member => {
        console.log(`      - ${member.user?.name || 'Unknown'} (${member.user?.email || 'Unknown'}) - ${member.role}`);
      });
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkData();
