import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'UTIL'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">Welcome to ${process.env.APP_NAME || 'UTIL'}!</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Hi ${name},</p>
            
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
              Thank you for registering! Please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #3B82F6, #6366F1); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="font-size: 13px; color: #3B82F6; word-break: break-all; background-color: white; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
              ⏰ This link will expire in 24 hours.
            </p>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} ${process.env.APP_NAME || 'UTIL'}. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ Verification email sent to:', email);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'UTIL'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to UTIL!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">🎉 You're All Set!</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Hi ${name},</p>
            
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
              Your email has been verified successfully! You can now log in and start using UTIL.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #3B82F6, #6366F1); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Go to Login
              </a>
            </div>
          </div>
        </div>
      `,
    });

    console.log('✅ Welcome email sent to:', email);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};