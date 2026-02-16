import { sendEmailHtml } from '../utils/sendEmail.js';

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    const to = process.env.CONTACT_EMAIL || process.env.OWNER_EMAIL;
    if (!to) {
      return res.status(500).json({
        success: false,
        message: 'Contact email not configured'
      });
    }

    const safePhone = phone ? `<p><strong>Phone:</strong> ${phone}</p>` : '';

    await sendEmailHtml({
      to,
      subject: `Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${safePhone}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f8fafc;padding:12px;border-radius:8px;">${message}</div>
        </div>
      `
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
