// Script to delete all users from the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Household from './models/Household.js';
import Contribution from './models/Contribution.js';
import Expense from './models/Expense.js';
import Bill from './models/Bill.js';

dotenv.config();

const deleteAllUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Delete all users
    const usersDeleted = await User.deleteMany({});
    console.log(`✅ Deleted ${usersDeleted.deletedCount} users`);

    // Delete all households
    const householdsDeleted = await Household.deleteMany({});
    console.log(`✅ Deleted ${householdsDeleted.deletedCount} households`);

    // Delete all contributions
    const contributionsDeleted = await Contribution.deleteMany({});
    console.log(`✅ Deleted ${contributionsDeleted.deletedCount} contributions`);

    // Delete all expenses
    const expensesDeleted = await Expense.deleteMany({});
    console.log(`✅ Deleted ${expensesDeleted.deletedCount} expenses`);

    // Delete all bills
    const billsDeleted = await Bill.deleteMany({});
    console.log(`✅ Deleted ${billsDeleted.deletedCount} bills`);

    console.log('✅ All data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteAllUsers();
