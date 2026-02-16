import Feedback from '../models/Feedback.js';
import { sendEmailNotification, sendWhatsAppNotification } from '../services/notificationService.js';

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req, res) => {
  try {
    const { rating, message, page, userAgent, country } = req.body || {};

    if (!rating || !message || !country || !String(country).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rating, message, and country are required'
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      household: req.user.household || undefined,
      rating: Number(rating),
      message,
      page,
      country: String(country).trim(),
      userAgent
    });

    try {
      const User = (await import('../models/User.js')).default;
      await User.findByIdAndUpdate(req.user.id, {
        hasSubmittedFeedback: true,
        feedbackSubmittedAt: new Date(),
        country: String(country).trim()
      });
    } catch (updateError) {
      console.error('Failed to update user feedback status:', updateError?.message || updateError);
    }

    const ownerEmail = process.env.OWNER_EMAIL;
    const ownerWhatsApp = process.env.OWNER_WHATSAPP;
    const whatsappEnabled = process.env.FEEDBACK_WHATSAPP_ENABLED === 'true';
    const payload = {
      rating: Number(rating),
      message,
      page,
      userAgent,
      country,
      userName: req.user?.name,
      userEmail: req.user?.email
    };

    try {
      if (ownerEmail) {
        await sendEmailNotification(ownerEmail, 'feedback', payload);
      }
      if (ownerWhatsApp && whatsappEnabled) {
        await sendWhatsAppNotification(ownerWhatsApp, 'feedback', payload);
      }
    } catch (notifyError) {
      console.error('Feedback owner notification failed:', notifyError?.message || notifyError);
    }

    return res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};
