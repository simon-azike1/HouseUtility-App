import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAdminMetrics, deleteFeedback, listFeedback, listUsers } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);

router.get('/metrics', getAdminMetrics);
router.get('/feedback', listFeedback);
router.get('/users', listUsers);
router.delete('/feedback/:id', deleteFeedback);

export default router;
