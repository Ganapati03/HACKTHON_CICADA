import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

export const jobController = {
  async getAllJobs(req, res) {
    try {
      const jobs = await Job.find({ status: 'Active' }).populate('postedBy', 'name email');
      res.status(200).json({
        message: 'Jobs retrieved',
        jobs,
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getJobById(req, res) {
    try {
      const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json({
        message: 'Job retrieved',
        job,
      });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createJob(req, res) {
    try {
      const { title, department, description, location, type, salary, requirements } = req.body;

      if (!title || !department || !description || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const job = new Job({
        title,
        department,
        description,
        location,
        type,
        salary,
        requirements,
        postedBy: req.user.id,
      });

      await job.save();
      res.status(201).json({
        message: 'Job posted successfully',
        job,
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateJob(req, res) {
    try {
      const { title, description, location, salary, status } = req.body;
      const updates = {};

      if (title) updates.title = title;
      if (description) updates.description = description;
      if (location) updates.location = location;
      if (salary) updates.salary = salary;
      if (status) updates.status = status;

      updates.updatedAt = new Date();

      const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json({
        message: 'Job updated successfully',
        job,
      });
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async deleteJob(req, res) {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json({
        message: 'Job deleted successfully',
      });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getJobStats(req, res) {
    try {
      const totalJobs = await Job.countDocuments({ status: 'Active' });
      const totalApplicants = await Application.countDocuments();
      
      const applicantsByStatus = await Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      res.status(200).json({
        message: 'Job stats retrieved',
        stats: {
          totalJobs,
          totalApplicants,
          applicantsByStatus,
        },
      });
    } catch (error) {
      console.error('Get job stats error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
