// backend/routes/household.js
import express from 'express';
import { protect as verifyToken } from '../middleware/auth.js';
import {
  getHousehold,
  getMembers,
  joinHousehold,
  updateMemberRole,
  removeMember
} from '../controllers/houseController.js';

const router = express.Router();

// Get household details
router.get('/', verifyToken, getHousehold);

// Get household members
router.get('/members', verifyToken, getMembers);

// Join household with invite code
router.post('/join', verifyToken, joinHousehold);

// Update member role (admin only)
router.put('/members/:userId/role', verifyToken, updateMemberRole);

// Remove member (admin only)
router.delete('/members/:userId', verifyToken, removeMember);

export default router;
