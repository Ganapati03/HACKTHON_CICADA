import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { geminiClient } from '../utils/geminiClient.js';
import { mail } from '../utils/mail.js';
import fs from 'fs';

export const applicationController = {
  async createApplication(req, res) {
    try {
      console.log('📝 Application submission received');
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      const { jobId, jobTitle, name, email, position } = req.body;
      const resumeUrl = req.file?.path || null;
      const resumeCloudinaryId = req.file?.filename || null;

      console.log('Parsed data:', { jobId, jobTitle, name, email, position, resumeUrl });

      if (!jobId || !name || !email || !position) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!resumeUrl) {
        console.log('❌ No resume file uploaded');
        return res.status(400).json({ message: 'Resume file is required' });
      }

      // Check if already applied
      console.log('🔍 Checking for existing application...');
      const existingApp = await Application.findOne({ jobId, email });
      if (existingApp) {
        console.log('❌ Already applied for this job');
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      console.log('✅ Starting AI resume analysis...');
      // AI Resume Analysis
      let aiScore = 75; // Default score
      let aiAnalysis = 'Resume received and processed';
      
      try {
        const analysisResult = await geminiClient.analyzeResume(resumeUrl);
        const parsed = JSON.parse(analysisResult);
        aiScore = parsed.score || 75;
        aiAnalysis = analysisResult;
        console.log('✅ AI Analysis complete. Score:', aiScore);
      } catch (aiError) {
        console.log('⚠️  AI analysis skipped:', aiError.message);
      }

      console.log('💾 Creating application document...');
      const application = new Application({
        applicantId: req.user?.id || null,
        jobId,
        jobTitle,
        name,
        email,
        position,
        resumeUrl,
        resumeCloudinaryId,
        aiScore,
        aiAnalysis,
        status: 'Under Review',
      });

      console.log('💾 Saving to database...');
      await application.save();
      console.log('✅ Application saved to database:', application._id);

      // Send acknowledgment email
      try {
        console.log('📧 Sending acknowledgment email...');
        await mail.sendApplicationAcknowledgment(email, name, position);
        console.log('✅ Acknowledgment email sent');
      } catch (emailError) {
        console.log('⚠️  Email sending failed:', emailError.message);
      }

      // Update job applicant count
      try {
        console.log('📊 Updating job applicant count...');
        await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });
        console.log('✅ Job applicant count updated');
      } catch (jobError) {
        console.log('⚠️  Job update failed:', jobError.message);
      }

      res.status(201).json({
        message: 'Application submitted successfully',
        application,
      });
    } catch (error) {
      console.error('❌ Create application error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  async getApplications(req, res) {
    try {
      const applications = await Application.find({ applicantId: req.user.id })
        .populate('jobId', 'title location salary');

      res.status(200).json({
        message: 'Applications retrieved',
        applications,
      });
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getAllApplications(req, res) {
    try {
      const applications = await Application.find()
        .populate('jobId', 'title')
        .sort({ appliedDate: -1 });

      res.status(200).json({
        message: 'All applications retrieved',
        applications,
      });
    } catch (error) {
      console.error('Get all applications error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getApplicationById(req, res) {
    try {
      const application = await Application.findById(req.params.id)
        .populate('jobId');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      res.status(200).json({
        message: 'Application retrieved',
        application,
      });
    } catch (error) {
      console.error('Get application error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateApplicationStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ['Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Send email based on status
      if (status === 'Selected') {
        await mail.sendSelectionEmail(application.email, application.name, application.position);
      } else if (status === 'Rejected') {
        await mail.sendRejectionEmail(application.email, application.name, application.position);
      } else if (status === 'Interview Scheduled') {
        // Send interview invite (you can add specific date/time in request body)
        const date = req.body.interviewDate || 'TBD';
        const time = req.body.interviewTime || '10:00 AM';
        await mail.sendInterviewInvite(application.email, application.name, application.position, date, time);
      }

      res.status(200).json({
        message: 'Application status updated',
        application,
      });
    } catch (error) {
      console.error('Update application error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
