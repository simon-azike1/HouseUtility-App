import express from 'express';
import { protect } from '../middleware/auth.js';
import { createFeedback } from '../controllers/feedbackController.js';
import { sendWhatsAppNotification } from '../services/notificationService.js';

const router = express.Router();

router.use(protect);

router.post('/', createFeedback);

router.post('/test-whatsapp', protect, async (req, res) => {
  try {
    const ownerWhatsApp = process.env.OWNER_WHATSAPP;
    if (!ownerWhatsApp) {
      return res.status(400).json({ success: false, message: 'OWNER_WHATSAPP not configured' });
    }

    const result = await sendWhatsAppNotification(ownerWhatsApp, 'feedback', {
      rating: 5,
      message: 'Test feedback WhatsApp message',
      userName: req.user?.name,
      userEmail: req.user?.email,
      country: 'Test Country'
    });

    return res.json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
