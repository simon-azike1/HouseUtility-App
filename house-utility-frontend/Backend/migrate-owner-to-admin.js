import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Household from './models/Household.js';

dotenv.config();

const migrateOwnerToAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all users with householdRole "owner" to "admin"
    const userResult = await User.updateMany(
      { householdRole: 'owner' },
      { $set: { householdRole: 'admin' } }
    );
    console.log(`Updated ${userResult.modifiedCount} users from owner to admin`);

    // Update all household members with role "owner" to "admin"
    const householdResult = await Household.updateMany(
      { 'members.role': 'owner' },
      { $set: { 'members.$[elem].role': 'admin' } },
      { arrayFilters: [{ 'elem.role': 'owner' }] }
    );
    console.log(`Updated ${householdResult.modifiedCount} household member records from owner to admin`);

    // Verify the changes
    const remainingOwners = await User.countDocuments({ householdRole: 'owner' });
    console.log(`Remaining users with "owner" role: ${remainingOwners}`);

    const remainingHouseholdOwners = await Household.countDocuments({ 'members.role': 'owner' });
    console.log(`Remaining household members with "owner" role: ${remainingHouseholdOwners}`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateOwnerToAdmin();
