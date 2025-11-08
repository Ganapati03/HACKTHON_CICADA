import nodemailer from 'nodemailer';

let transporter;

if (process.env.NODE_ENV === 'production') {
  // Gmail SMTP for production
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Testmail.app for development
  transporter = nodemailer.createTransport({
    host: 'testmail.app',
    port: 25,
    secure: false,
    auth: {
      user: process.env.TESTMAIL_NAMESPACE,
      pass: process.env.TESTMAIL_API_KEY,
    },
  });
}

export const mail = {
  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendContactReply(to, subject, htmlContent) {
    return this.sendEmail(to, subject, htmlContent);
  },

  async sendApplicationAcknowledgment(to, candidateName, position) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Application Received ✓</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for applying for the <strong>${position}</strong> position at Mastersolis Infotech.</p>
        <p>Your resume has been received and our AI system is now analyzing your qualifications. We'll review your application and get back to you within 3-5 business days.</p>
        <p>Meanwhile, feel free to <a href="${process.env.CLIENT_URL}/user/applications">track your application status</a> on our portal.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Best regards,<br/>Mastersolis Infotech HR Team</p>
      </div>
    `;
    return this.sendEmail(to, `Application Received - ${position}`, html);
  },

  async sendSelectionEmail(to, candidateName, position) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">🎉 Congratulations!</h2>
        <p>Dear ${candidateName},</p>
        <p>We are pleased to inform you that you have been <strong>selected</strong> for the <strong>${position}</strong> position at Mastersolis Infotech!</p>
        <p>Your qualifications impressed our team, and we believe you'll be a great addition to our organization.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Our HR team will contact you within 2 business days</li>
          <li>Please prepare necessary documents for verification</li>
          <li>We'll discuss onboarding details and benefits</li>
        </ul>
        <p>Thank you for your interest in Mastersolis Infotech!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Best regards,<br/>Mastersolis Infotech HR Team</p>
      </div>
    `;
    return this.sendEmail(to, `Selected - ${position} at Mastersolis Infotech`, html);
  },

  async sendRejectionEmail(to, candidateName, position) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for your interest in the <strong>${position}</strong> position at Mastersolis Infotech.</p>
        <p>After careful consideration of all applications, we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
        <p>We encourage you to keep an eye on our <a href="${process.env.CLIENT_URL}/careers">careers page</a> for future opportunities that align with your skills and experience.</p>
        <p>We wish you the best in your career journey!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Best regards,<br/>Mastersolis Infotech HR Team</p>
      </div>
    `;
    return this.sendEmail(to, `Application Update - ${position}`, html);
  },

  async sendInterviewInvite(to, candidateName, position, date, time) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">📅 Interview Invitation</h2>
        <p>Dear ${candidateName},</p>
        <p>We are excited to invite you for an interview for the <strong>${position}</strong> position!</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time} IST</li>
          <li><strong>Format:</strong> Video Call (Link will be sent separately)</li>
          <li><strong>Duration:</strong> ~45 minutes</li>
        </ul>
        <p>Please confirm your availability by replying to this email.</p>
        <p>Good luck! We look forward to meeting you.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Best regards,<br/>Mastersolis Infotech HR Team</p>
      </div>
    `;
    return this.sendEmail(to, `Interview Invitation - ${position}`, html);
  },
};
