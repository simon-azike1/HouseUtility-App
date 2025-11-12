import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get logged-in user
router.get('/me', protect, getMe);

// ✅ Get all registered users (household members)
router.get('/users', protect, getAllUsers);

export default router;
