// routes/bills.js
import express from 'express';
const router = express.Router();
import {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  markBillAsPaid,
  getUpcomingBills,
  getStats
} from '../controllers/billController.js';
import { protect } from '../middleware/auth.js';

// Protect all routes
router.use(protect);

// Routes
router.route('/stats').get(getStats);
router.route('/upcoming').get(getUpcomingBills);
router.route('/').get(getBills).post(createBill);
router.route('/:id').get(getBill).put(updateBill).delete(deleteBill);
router.route('/:id/pay').post(markBillAsPaid);

export default router;