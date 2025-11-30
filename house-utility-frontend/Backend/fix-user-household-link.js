// Fix user-household link
import mongoose from 'mongoose';
import User from './models/User.js';
import Household from './models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const fixUserHouseholdLink = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users without household
    const usersWithoutHousehold = await User.find({ household: null });
    console.log(`Found ${usersWithoutHousehold.length} users without household link\n`);

    for (const user of usersWithoutHousehold) {
      console.log(`Checking user: ${user.email}`);

      // Find household where this user is a member
      const household = await Household.findOne({
        'members.user': user._id
      });

      if (household) {
        console.log(`  ✅ Found household: ${household.name}`);

        // Update user with household reference
        user.household = household._id;

        // Set role based on household member role
        const member = household.members.find(m => m.user.toString() === user._id.toString());
        user.householdRole = member?.role || 'member';

        await user.save();
        console.log(`  ✅ Updated user with household: ${household._id} and role: ${user.householdRole}\n`);
      } else {
        console.log(`  ⚠️ No household found for this user\n`);
      }
    }

    console.log('✅ Fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixUserHouseholdLink();
