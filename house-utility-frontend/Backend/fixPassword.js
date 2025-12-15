// Script to reset a user's password (in case it was double-hashed)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const fixPassword = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const email = await question('Enter user email: ');
    const newPassword = await question('Enter new password: ');

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log(`\n📧 Found user: ${user.name} (${user.email})`);

    // Set new password - the pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    console.log('\n✅ Password updated successfully!');
    console.log(`You can now login with:`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPassword();
