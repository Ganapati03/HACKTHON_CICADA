import { ExamRequest } from '../models/ExamRequest.js';
import { Exam } from '../models/Exam.js';

export const examRequestController = {
  // HR creates exam request
  async createRequest(req, res) {
    try {
      const { title, description, difficulty, duration, priority } = req.body;

      if (!title || !description || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const examRequest = new ExamRequest({
        title,
        description,
        difficulty,
        duration,
        priority: priority || 'medium',
        requestedBy: req.user.id,
        status: 'pending',
      });

      await examRequest.save();

      res.status(201).json({
        message: 'Exam request created successfully',
        examRequest,
      });
    } catch (error) {
      console.error('Create exam request error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all exam requests
  async getAllRequests(req, res) {
    try {
      const requests = await ExamRequest.find()
        .populate('requestedBy', 'name email')
        .populate('examId', 'title')
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: 'Exam requests retrieved',
        requests,
      });
    } catch (error) {
      console.error('Get exam requests error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Examiner accepts request
  async acceptRequest(req, res) {
    try {
      const { requestId } = req.params;

      const examRequest = await ExamRequest.findById(requestId);
      if (!examRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (examRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Request already processed' });
      }

      examRequest.status = 'accepted';
      examRequest.respondedAt = new Date();
      await examRequest.save();

      res.status(200).json({
        message: 'Request accepted successfully',
        examRequest,
      });
    } catch (error) {
      console.error('Accept request error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Examiner rejects request
  async rejectRequest(req, res) {
    try {
      const { requestId } = req.params;

      const examRequest = await ExamRequest.findById(requestId);
      if (!examRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (examRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Request already processed' });
      }

      examRequest.status = 'rejected';
      examRequest.respondedAt = new Date();
      await examRequest.save();

      res.status(200).json({
        message: 'Request rejected',
        examRequest,
      });
    } catch (error) {
      console.error('Reject request error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Link exam to request (when examiner creates exam for this request)
  async linkExamToRequest(req, res) {
    try {
      const { requestId, examId } = req.body;

      const examRequest = await ExamRequest.findById(requestId);
      if (!examRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      examRequest.examId = examId;
      examRequest.status = 'completed';
      await examRequest.save();

      res.status(200).json({
        message: 'Exam linked to request successfully',
        examRequest,
      });
    } catch (error) {
      console.error('Link exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete request
  async deleteRequest(req, res) {
    try {
      const examRequest = await ExamRequest.findByIdAndDelete(req.params.id);

      if (!examRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.status(200).json({
        message: 'Request deleted successfully',
      });
    } catch (error) {
      console.error('Delete request error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
