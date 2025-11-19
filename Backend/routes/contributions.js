// routes/contributions.js
import express from 'express';
import {
  getContributions,
  getContribution,
  createContribution,
  updateContribution,
  deleteContribution,
  getStats
} from '../controllers/contributionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.route('/stats').get(getStats);
router.route('/')
  .get(getContributions)
  .post(createContribution);
router.route('/:id')
  .get(getContribution)
  .put(updateContribution)
  .delete(deleteContribution);

export default router;
