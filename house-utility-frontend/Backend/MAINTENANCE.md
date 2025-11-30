# Database Maintenance Guide

This document explains how to maintain database integrity and troubleshoot household-related issues.

## Quick Start

### Run Database Cleanup
```bash
cd Backend
npm run cleanup
```

This will automatically:
- Remove orphaned households (households whose owners no longer exist)
- Fix user-household links
- Report and fix inconsistencies

### Check Database Status
```bash
node check-all-data.js
```

Shows all users and households with their relationships.

## Common Issues & Solutions

### Issue 1: User shows "No Household Found" after registration

**Cause**: Household creation failed during email verification, or orphaned household exists from deleted user.

**Solution**:
```bash
# Option 1: Run cleanup script (recommended)
npm run cleanup

# Option 2: Manually create household for specific user
node create-household-for-user.js
# (Edit the email in the script first)
```

### Issue 2: Orphaned households after deleting users

**Cause**: Users were deleted directly from database without cleaning up their households.

**Solution**:
```bash
# Run cleanup to remove orphaned households
npm run cleanup

# Or manually remove specific household
node cleanup-orphaned-households.js
```

### Issue 3: User has household but can't see it

**Cause**: User document has household ID, but isn't in the household's members array (or vice versa).

**Solution**:
```bash
# Cleanup script will detect and fix this
npm run cleanup
```

## Utility Scripts

All scripts are in the `Backend/` directory:

### Core Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `check-all-data.js` | View all users and households | Debugging, verifying data |
| `check-user.js` | View specific user data | Check individual user status |
| `check-ids.js` | Compare user and household IDs | Debug ID mismatches |

### Fix Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `cleanup-database.js` | **Main cleanup utility** | Regular maintenance, after bulk operations |
| `cleanup-orphaned-households.js` | Remove households without owners | After deleting users |
| `fix-user-household-link.js` | Fix broken user↔household links | User has no household reference |
| `create-household-for-user.js` | Create household for specific user | Manual household creation needed |

### Running Scripts

```bash
# Navigate to Backend folder
cd house-utility-frontend/Backend

# Run any script
node <script-name>.js

# Or use npm script
npm run cleanup
```

## Best Practices

### 1. Regular Maintenance
Run cleanup script weekly or after:
- Bulk user deletion
- Database migrations
- Testing/development cycles

### 2. Before Deleting Users
```bash
# Check what will be affected
node check-all-data.js

# Delete user (use proper API endpoints, not direct DB deletion)
# API will handle household cleanup

# If you must delete directly from DB:
# 1. Delete user
# 2. Run cleanup
npm run cleanup
```

### 3. Monitoring

Enable detailed logging by checking backend console for:
- `📊 Household status` - Shows household creation status
- `✅ Created household` - Confirms successful creation
- `❌ ERROR during household creation` - Alerts to failures

## Error Handling Improvements

The system now includes:

### Comprehensive Logging
- Every household creation/join operation is logged
- User-household relationship changes are tracked
- Errors are caught and logged without breaking verification

### Graceful Degradation
If household creation fails during verification:
- User verification still completes
- User can manually join/create household later via Profile page
- Error is logged for admin review

### Automatic Recovery
The cleanup script can detect and fix:
- Orphaned households
- Broken user-household links
- Inconsistent member arrays

## Troubleshooting

### Check Backend Logs

Look for these log patterns:

```
✅ Created household: <name> (ID: <id>, Code: <code>)
✅ Household assignment complete
```

If you see:
```
❌ ERROR during household creation
⚠️ Continuing with verification despite household error
```

Then household creation failed. Run cleanup script to fix.

### Verify Data Integrity

```bash
# Check specific user
node check-user.js
# Edit email in script first

# Check all data
node check-all-data.js

# Verify IDs match
node check-ids.js
```

### Reset Everything (Development Only)

```bash
# WARNING: This deletes all data!

# 1. Drop database in MongoDB Compass
# OR use mongosh:
mongosh
use <your-database-name>
db.dropDatabase()

# 2. Restart server (will create fresh schema)
npm run dev
```

## API Endpoints for Household Management

### User Can Join Household
```http
POST /api/household/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviteCode": "ABC12XYZ"
}
```

### Get Household Info
```http
GET /api/household
Authorization: Bearer <token>
```

## Preventive Measures

### Use API Endpoints for User Operations
Always use API endpoints instead of direct database manipulation:

```javascript
// ✅ Good - Use API
DELETE /api/users/:id  // Will handle cleanup

// ❌ Bad - Direct DB
db.users.deleteOne({ email: "..." })  // Leaves orphaned household
```

### Test Household Creation
After any auth changes, test:
1. New user registration
2. Email verification
3. Check Profile → Household tab
4. Verify invite code appears

### Run Cleanup After Bulk Operations
```bash
# After bulk user imports
npm run cleanup

# After testing
npm run cleanup

# After database migrations
npm run cleanup
```

## Support

If issues persist after running cleanup:

1. Check backend server logs
2. Run `node check-all-data.js` and save output
3. Review error messages
4. Contact system administrator with logs

## Scheduled Maintenance

Consider setting up cron job for automatic cleanup:

```bash
# Run cleanup every Sunday at 2 AM
0 2 * * 0 cd /path/to/Backend && npm run cleanup >> /var/log/household-cleanup.log 2>&1
```

---

**Last Updated**: 2025-01-29
**Version**: 1.0.0
