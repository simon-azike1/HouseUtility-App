// Remove orphaned "Unknown" member from household
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupUnknownMember = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const household = await Household.findOne({ inviteCode: 'NJUETP8F' }).populate('members.user');

    if (!household) {
      console.log('❌ Household not found');
      process.exit(1);
    }

    console.log(`Found household: ${household.name}`);
    console.log(`Members before cleanup: ${household.members.length}\n`);

    // Remove members with invalid user references
    const validMembers = household.members.filter(member => {
      if (!member.user || !member.user._id) {
        console.log(`🗑️ Removing orphaned member entry`);
        return false;
      }
      console.log(`✅ Keeping: ${member.user.name} (${member.user.email})`);
      return true;
    });

    household.members = validMembers;
    await household.save();

    console.log(`\n✅ Cleanup complete!`);
    console.log(`Members after cleanup: ${household.members.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupUnknownMember();
