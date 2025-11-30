// Check IDs to see the mismatch
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const checkIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email: 'azikeshinye@gmail.com' });
    const household = await Household.findOne({});

    console.log('USER:');
    console.log(`  Email: ${user.email}`);
    console.log(`  User ID: ${user._id}`);
    console.log(`  User household field: ${user.household}`);
    console.log('');

    console.log('HOUSEHOLD:');
    console.log(`  Name: ${household.name}`);
    console.log(`  Household ID: ${household._id}`);
    console.log(`  Owner ID: ${household.owner}`);
    console.log(`  Members:`);
    household.members.forEach((member, index) => {
      console.log(`    [${index}] User ID: ${member.user}`);
      console.log(`        Role: ${member.role}`);
      console.log(`        Match: ${member.user.toString() === user._id.toString() ? '✅ YES' : '❌ NO'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkIds();
