import { mail } from '../utils/mail.js';
import { geminiClient } from '../utils/geminiClient.js';

export const emailController = {
  async sendContactEmail(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Generate AI response
      let aiResponse = `Thank you for reaching out! We've received your message and will get back to you soon.`;
      try {
        aiResponse = await geminiClient.generateEmailContent('contact_reply', name, {
          subject,
          message,
        });
      } catch (aiError) {
        console.log('AI response generation skipped');
      }

      // Send reply to user
      await mail.sendContactReply(email, `Re: ${subject}`, aiResponse);

      // You can also log this in database if needed
      res.status(200).json({
        message: 'Email sent successfully',
        aiResponse,
      });
    } catch (error) {
      console.error('Send contact email error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async sendApplicationStatusEmail(req, res) {
    try {
      const { email, candidateName, position, status, interviewDate, interviewTime } = req.body;

      if (!email || !candidateName || !position || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let emailResult;

      if (status === 'selected') {
        emailResult = await mail.sendSelectionEmail(email, candidateName, position);
      } else if (status === 'rejected') {
        emailResult = await mail.sendRejectionEmail(email, candidateName, position);
      } else if (status === 'interview') {
        emailResult = await mail.sendInterviewInvite(email, candidateName, position, interviewDate, interviewTime);
      } else {
        return res.status(400).json({ message: 'Invalid status' });
      }

      res.status(200).json({
        message: 'Email sent successfully',
        result: emailResult,
      });
    } catch (error) {
      console.error('Send application email error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async sendBulkEmail(req, res) {
    try {
      const { recipients, subject, htmlContent } = req.body;

      if (!recipients || !subject || !htmlContent) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const results = [];
      for (const recipient of recipients) {
        const result = await mail.sendEmail(recipient.email, subject, htmlContent);
        results.push({ email: recipient.email, ...result });
      }

      res.status(200).json({
        message: 'Bulk emails sent',
        results,
      });
    } catch (error) {
      console.error('Send bulk email error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async sendCustomEmail(req, res) {
    try {
      const { to, subject, html } = req.body;

      if (!to || !subject || !html) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await mail.sendEmail(to, subject, html);
      res.status(200).json({
        message: 'Email sent successfully',
        result,
      });
    } catch (error) {
      console.error('Send custom email error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
