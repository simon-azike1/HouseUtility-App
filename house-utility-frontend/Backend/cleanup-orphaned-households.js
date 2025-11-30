// Cleanup orphaned households (households whose owners don't exist)
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupOrphanedHouseholds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const households = await Household.find({});
    console.log(`Found ${households.length} households\n`);

    for (const household of households) {
      console.log(`Checking household: ${household.name} (${household._id})`);
      console.log(`  Owner ID: ${household.owner}`);

      // Check if owner exists
      const owner = await User.findById(household.owner);

      if (!owner) {
        console.log(`  ❌ Owner not found! Deleting orphaned household...`);
        await Household.findByIdAndDelete(household._id);
        console.log(`  ✅ Deleted household: ${household.name}\n`);
      } else {
        console.log(`  ✅ Owner exists: ${owner.email}\n`);
      }
    }

    console.log('✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupOrphanedHouseholds();
