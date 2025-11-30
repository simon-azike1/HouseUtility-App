#!/usr/bin/env node
/**
 * Database Cleanup Utility
 *
 * This script performs database maintenance tasks:
 * 1. Removes orphaned households (households whose owners no longer exist)
 * 2. Fixes user-household links (users who should have households but don't)
 * 3. Reports inconsistencies
 *
 * Usage: node scripts/cleanup-database.js
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import Household from '../models/Household.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let totalIssuesFixed = 0;

    // ============================================
    // 1. Find and remove orphaned households
    // ============================================
    console.log('📋 Task 1: Checking for orphaned households...');
    const households = await Household.find({});
    console.log(`   Found ${households.length} households\n`);

    let orphanedCount = 0;
    for (const household of households) {
      const owner = await User.findById(household.owner);

      if (!owner) {
        console.log(`   ❌ Orphaned household found:`);
        console.log(`      Name: ${household.name}`);
        console.log(`      ID: ${household._id}`);
        console.log(`      Owner ID: ${household.owner} (DOES NOT EXIST)`);
        console.log(`      🗑️  Deleting...`);

        await Household.findByIdAndDelete(household._id);
        orphanedCount++;
        totalIssuesFixed++;
        console.log(`      ✅ Deleted\n`);
      }
    }

    if (orphanedCount === 0) {
      console.log('   ✅ No orphaned households found\n');
    } else {
      console.log(`   ✅ Removed ${orphanedCount} orphaned household(s)\n`);
    }

    // ============================================
    // 2. Fix user-household links
    // ============================================
    console.log('📋 Task 2: Checking user-household links...');
    const usersWithoutHousehold = await User.find({ household: null, isVerified: true });
    console.log(`   Found ${usersWithoutHousehold.length} verified users without household\n`);

    let fixedLinksCount = 0;
    for (const user of usersWithoutHousehold) {
      console.log(`   🔍 Checking user: ${user.email}`);

      // Check if household exists where this user is a member
      const household = await Household.findOne({
        'members.user': user._id
      });

      if (household) {
        console.log(`      ✅ Found household: ${household.name}`);

        // Get user's role from household
        const member = household.members.find(m => m.user.toString() === user._id.toString());
        const role = member?.role || 'member';

        // Update user
        user.household = household._id;
        user.householdRole = role;
        await user.save();

        fixedLinksCount++;
        totalIssuesFixed++;
        console.log(`      ✅ Fixed link - Household: ${household._id}, Role: ${role}\n`);
      } else {
        console.log(`      ⚠️  No household found - user should create/join one\n`);
      }
    }

    if (fixedLinksCount === 0 && usersWithoutHousehold.length === 0) {
      console.log('   ✅ All user-household links are correct\n');
    } else if (fixedLinksCount > 0) {
      console.log(`   ✅ Fixed ${fixedLinksCount} user-household link(s)\n`);
    }

    // ============================================
    // 3. Report inconsistencies
    // ============================================
    console.log('📋 Task 3: Checking for inconsistencies...');

    // Check users who have household but don't exist in members array
    const allUsers = await User.find({ household: { $ne: null } });
    let inconsistentUsers = 0;

    for (const user of allUsers) {
      const household = await Household.findById(user.household);

      if (!household) {
        console.log(`   ⚠️  User ${user.email} has household ${user.household} but it doesn't exist`);
        console.log(`      Removing household reference from user...`);
        user.household = null;
        user.householdRole = null;
        await user.save();
        inconsistentUsers++;
        totalIssuesFixed++;
        console.log(`      ✅ Fixed\n`);
      } else {
        const isMember = household.members.some(m => m.user.toString() === user._id.toString());
        if (!isMember) {
          console.log(`   ⚠️  User ${user.email} has household ${household.name} but is not in members array`);
          console.log(`      Removing household reference from user...`);
          user.household = null;
          user.householdRole = null;
          await user.save();
          inconsistentUsers++;
          totalIssuesFixed++;
          console.log(`      ✅ Fixed\n`);
        }
      }
    }

    if (inconsistentUsers === 0) {
      console.log('   ✅ No inconsistencies found\n');
    } else {
      console.log(`   ✅ Fixed ${inconsistentUsers} inconsistency/inconsistencies\n`);
    }

    // ============================================
    // Summary
    // ============================================
    console.log('═'.repeat(50));
    console.log('📊 CLEANUP SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total issues fixed: ${totalIssuesFixed}`);
    console.log(`  - Orphaned households removed: ${orphanedCount}`);
    console.log(`  - User-household links fixed: ${fixedLinksCount}`);
    console.log(`  - Inconsistencies resolved: ${inconsistentUsers}`);
    console.log('═'.repeat(50));

    if (totalIssuesFixed === 0) {
      console.log('\n✨ Database is clean! No issues found.');
    } else {
      console.log(`\n✨ Cleanup complete! Fixed ${totalIssuesFixed} issue(s).`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR during cleanup:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

cleanupDatabase();
