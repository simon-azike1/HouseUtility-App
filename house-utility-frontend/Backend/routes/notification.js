// routes/notification.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  sendEmailNotification,
  sendWhatsAppNotification,
  notifyHousehold
} from '../services/notificationService.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get('/', protect, getNotifications);

// Get unread notification count
router.get('/unread-count', protect, getUnreadCount);

// Mark notification as read
router.put('/:id/read', protect, markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', protect, markAllAsRead);

// Delete a notification
router.delete('/:id', protect, deleteNotification);

// Delete all read notifications
router.delete('/clear-read', protect, clearReadNotifications);

// Test email notification
router.post('/test-email', protect, async (req, res) => {
  try {
    const { type, data } = req.body;
    const result = await sendEmailNotification(req.user.email, type, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Test WhatsApp notification
router.post('/test-whatsapp', protect, async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!req.user.phoneNumber) {
      return res.status(400).json({ message: 'Phone number not configured in profile' });
    }

    const result = await sendWhatsAppNotification(req.user.phoneNumber, type, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send WhatsApp', error: error.message });
  }
});

// Notify entire household
router.post('/notify-household', protect, async (req, res) => {
  try {
    const { type, data, notificationSettings } = req.body;

    if (!req.user.household) {
      return res.status(400).json({ message: 'User not part of a household' });
    }

    const result = await notifyHousehold(req.user.household, type, data, notificationSettings);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to notify household', error: error.message });
  }
});

export default router;
