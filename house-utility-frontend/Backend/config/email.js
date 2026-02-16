// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  }

  // For other SMTP services (like SendGrid, Mailgun, etc.)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  return null;
};

const transporter = createTransporter();

// Verify transporter configuration
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('⚠️ Email transporter not configured (SMTP/Gmail).');
}

export default transporter;
