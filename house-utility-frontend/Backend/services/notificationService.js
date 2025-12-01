// services/notificationService.js
import transporter from '../config/email.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client (for WhatsApp)
let twilioClient = null;
if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_ACCOUNT_SID.startsWith('AC') // Validate it's a real Twilio SID
) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio WhatsApp client initialized');
  } catch (error) {
    console.error('⚠️ Failed to initialize Twilio client:', error.message);
  }
} else {
  console.log('⚠️ Twilio credentials not configured. WhatsApp notifications disabled.');
}

// Email Templates
const emailTemplates = {
  billReminder: (billDetails) => ({
    subject: `⚠️ Bill Due Soon: ${billDetails.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .bill-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .amount { font-size: 32px; font-weight: bold; color: #f59e0b; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💡 Bill Payment Reminder</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>This is a friendly reminder that you have an upcoming bill payment:</p>

              <div class="bill-details">
                <h2>${billDetails.title}</h2>
                <p><strong>Amount:</strong> <span class="amount">${billDetails.amount} ${billDetails.currency || 'MAD'}</span></p>
                <p><strong>Due Date:</strong> ${billDetails.dueDate}</p>
                <p><strong>Category:</strong> ${billDetails.category}</p>
              </div>

              <p>Don't forget to make your payment before the due date to avoid any late fees!</p>

              <a href="${process.env.FRONTEND_URL}/bills" class="button">View All Bills</a>

              <div class="footer">
                <p>This is an automated reminder from House Utility Management</p>
                <p>© 2024 House Utility. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  expenseAdded: (expenseDetails) => ({
    subject: `💰 New Expense Added: ${expenseDetails.description}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .expense-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .amount { font-size: 28px; font-weight: bold; color: #10b981; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 New Expense Added</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>A new expense has been added to your household:</p>

              <div class="expense-details">
                <h2>${expenseDetails.description}</h2>
                <p><strong>Amount:</strong> <span class="amount">${expenseDetails.amount} ${expenseDetails.currency || 'MAD'}</span></p>
                <p><strong>Category:</strong> ${expenseDetails.category}</p>
                <p><strong>Added by:</strong> ${expenseDetails.addedBy}</p>
                <p><strong>Date:</strong> ${expenseDetails.date}</p>
              </div>

              <a href="${process.env.FRONTEND_URL}/expenses" class="button">View All Expenses</a>

              <div class="footer">
                <p>This is an automated notification from House Utility Management</p>
                <p>© 2024 House Utility. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  contributionAdded: (contributionDetails) => ({
    subject: `🎉 New Contribution: ${contributionDetails.memberName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .contribution-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .amount { font-size: 28px; font-weight: bold; color: #3b82f6; }
            .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Contribution</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Great news! A household member has made a contribution:</p>

              <div class="contribution-details">
                <h2>${contributionDetails.memberName}'s Contribution</h2>
                <p><strong>Amount:</strong> <span class="amount">${contributionDetails.amount} ${contributionDetails.currency || 'MAD'}</span></p>
                <p><strong>Description:</strong> ${contributionDetails.description}</p>
                <p><strong>Date:</strong> ${contributionDetails.date}</p>
              </div>

              <a href="${process.env.FRONTEND_URL}/contributions" class="button">View All Contributions</a>

              <div class="footer">
                <p>This is an automated notification from House Utility Management</p>
                <p>© 2024 House Utility. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  monthlyReport: (reportData) => ({
    subject: `📊 Your Monthly Household Report - ${reportData.month}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-box { background: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; margin: 0 10px; }
            .stat-number { font-size: 32px; font-weight: bold; color: #8b5cf6; }
            .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Monthly Report</h1>
              <p>${reportData.month} ${reportData.year}</p>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Here's your household summary for ${reportData.month}:</p>

              <div class="stats">
                <div class="stat-box">
                  <div class="stat-number">${reportData.totalExpenses}</div>
                  <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${reportData.totalBills}</div>
                  <div class="stat-label">Bills Paid</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${reportData.totalContributions}</div>
                  <div class="stat-label">Contributions</div>
                </div>
              </div>

              <a href="${process.env.FRONTEND_URL}/reports" class="button">View Detailed Report</a>

              <div class="footer">
                <p>This is an automated monthly report from House Utility Management</p>
                <p>© 2024 House Utility. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  })
};

// WhatsApp Templates (Plain text for WhatsApp)
const whatsAppTemplates = {
  billReminder: (billDetails) =>
    `⚠️ *Bill Payment Reminder*\n\n` +
    `Hi! You have an upcoming bill:\n\n` +
    `*${billDetails.title}*\n` +
    `Amount: ${billDetails.amount} ${billDetails.currency || 'MAD'}\n` +
    `Due Date: ${billDetails.dueDate}\n` +
    `Category: ${billDetails.category}\n\n` +
    `Don't forget to pay before the due date!\n\n` +
    `View all bills: ${process.env.FRONTEND_URL}/bills`,

  expenseAdded: (expenseDetails) =>
    `💰 *New Expense Added*\n\n` +
    `${expenseDetails.description}\n` +
    `Amount: ${expenseDetails.amount} ${expenseDetails.currency || 'MAD'}\n` +
    `Category: ${expenseDetails.category}\n` +
    `Added by: ${expenseDetails.addedBy}\n\n` +
    `View expenses: ${process.env.FRONTEND_URL}/expenses`,

  contributionAdded: (contributionDetails) =>
    `🎉 *New Contribution*\n\n` +
    `${contributionDetails.memberName} contributed:\n` +
    `Amount: ${contributionDetails.amount} ${contributionDetails.currency || 'MAD'}\n` +
    `Description: ${contributionDetails.description}\n\n` +
    `View contributions: ${process.env.FRONTEND_URL}/contributions`
};

// Send Email Notification
export const sendEmailNotification = async (to, type, data) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('⚠️ Email not configured. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    const template = emailTemplates[type](data);

    const mailOptions = {
      from: `"House Utility" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp Notification
export const sendWhatsAppNotification = async (to, type, data) => {
  try {
    if (!twilioClient) {
      console.log('⚠️ WhatsApp not configured. Skipping WhatsApp notification.');
      return { success: false, message: 'WhatsApp not configured' };
    }

    const message = whatsAppTemplates[type](data);

    const result = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message
    });

    console.log('✅ WhatsApp sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Create in-app notification
export const createNotification = async (userId, householdId, notificationData) => {
  try {
    const Notification = (await import('../models/Notification.js')).default;

    const notification = await Notification.create({
      user: userId,
      household: householdId,
      type: notificationData.type || 'info',
      title: notificationData.title,
      message: notificationData.message,
      relatedTo: notificationData.relatedTo
    });

    return { success: true, notification };
  } catch (error) {
    console.error('❌ Failed to create notification:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to all household members
export const notifyHousehold = async (householdId, type, data, notificationSettings = {}) => {
  try {
    const User = (await import('../models/User.js')).default;
    const members = await User.find({ household: householdId });

    const results = [];

    // Map notification type to UI type and create message
    const notificationTypeMap = {
      billReminder: {
        uiType: 'warning',
        title: 'Bill Due Soon',
        getMessage: (data) => `${data.title} due in ${data.dueDate}`
      },
      expenseAdded: {
        uiType: 'info',
        title: 'Expense Added',
        getMessage: (data) => `${data.addedBy} added ${data.amount} ${data.currency || 'MAD'} for ${data.category}`
      },
      contributionAdded: {
        uiType: 'success',
        title: 'New Contribution',
        getMessage: (data) => `${data.memberName} added ${data.amount} ${data.currency || 'MAD'} for ${data.description}`
      }
    };

    const notifConfig = notificationTypeMap[type];

    for (const member of members) {
      // Create in-app notification for each member
      if (notifConfig) {
        await createNotification(member._id, householdId, {
          type: notifConfig.uiType,
          title: notifConfig.title,
          message: notifConfig.getMessage(data),
          relatedTo: data.relatedTo
        });
      }

      // Check user's notification preferences
      const { emailNotifications = true, phoneNumber } = member;

      // Send email if enabled
      if (emailNotifications && notificationSettings.email !== false) {
        const emailResult = await sendEmailNotification(member.email, type, data);
        results.push({ type: 'email', user: member.email, ...emailResult });
      }

      // Send WhatsApp if phone number exists and enabled
      if (phoneNumber && notificationSettings.whatsapp !== false) {
        const whatsappResult = await sendWhatsAppNotification(phoneNumber, type, data);
        results.push({ type: 'whatsapp', user: phoneNumber, ...whatsappResult });
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error('❌ Household notification failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendEmailNotification,
  sendWhatsAppNotification,
  notifyHousehold,
  createNotification
};
