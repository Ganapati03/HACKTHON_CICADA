import { Exam } from '../models/Exam.js';
import { Result } from '../models/Result.js';
import { CheatLog } from '../models/CheatLog.js';
import { geminiClient } from '../utils/geminiClient.js';

export const examController = {
  async getExams(req, res) {
    try {
      const exams = await Exam.find({ status: 'Active' })
        .populate('createdBy', 'name email')
        .select('-questions');

      res.status(200).json({
        message: 'Exams retrieved',
        exams,
      });
    } catch (error) {
      console.error('Get exams error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getExamById(req, res) {
    try {
      const exam = await Exam.findById(req.params.id)
        .populate('createdBy', 'name email');

      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      res.status(200).json({
        message: 'Exam retrieved',
        exam,
      });
    } catch (error) {
      console.error('Get exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createExam(req, res) {
    try {
      const { title, description, duration, difficulty, questions } = req.body;

      if (!title || !description || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let generatedQuestions = questions || [];

      // Generate questions with AI if not provided
      if (!questions) {
        try {
          const prompt = `Generate 5 multiple choice questions for a ${difficulty} level exam on: ${title}
          
Each question should have 4 options and indicate the correct answer (0-3).
Return as JSON array with objects: { id, question, options[], correctAnswer }`;
          
          const aiResponse = await geminiClient.generateContent(prompt);
          generatedQuestions = JSON.parse(aiResponse);
        } catch (aiError) {
          console.log('AI generation skipped, using provided questions');
        }
      }

      const exam = new Exam({
        title,
        description,
        duration,
        difficulty,
        questions: generatedQuestions,
        createdBy: req.user.id,
        aiGenerated: !questions,
      });

      await exam.save();
      res.status(201).json({
        message: 'Exam created successfully',
        exam,
      });
    } catch (error) {
      console.error('Create exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateExam(req, res) {
    try {
      const { title, description, duration, questions, status } = req.body;
      const updates = {};

      if (title) updates.title = title;
      if (description) updates.description = description;
      if (duration) updates.duration = duration;
      if (questions) updates.questions = questions;
      if (status) updates.status = status;

      updates.updatedAt = new Date();

      const exam = await Exam.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      res.status(200).json({
        message: 'Exam updated successfully',
        exam,
      });
    } catch (error) {
      console.error('Update exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async submitExam(req, res) {
    try {
      const { examId, answers, tabSwitches } = req.body;

      if (!examId || !answers) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Calculate score
      let correctAnswers = 0;
      exam.questions.forEach((question, index) => {
        if (answers[index] && parseInt(answers[index]) === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const percentage = Math.round((correctAnswers / exam.questions.length) * 100);

      // Get AI Feedback
      let aiFeedback = '';
      try {
        const feedbackPrompt = `Provide brief constructive feedback for someone who scored ${percentage}% on a ${exam.difficulty} level exam about ${exam.title}.`;
        aiFeedback = await geminiClient.generateContent(feedbackPrompt);
      } catch (aiError) {
        aiFeedback = 'Exam completed successfully';
      }

      const result = new Result({
        userId: req.user.id,
        examId,
        examTitle: exam.title,
        score: correctAnswers,
        percentage,
        answers,
        aiFeedback,
        tabSwitches: tabSwitches || 0,
      });

      await result.save();

      // Log cheat behavior if tab switches detected
      if (tabSwitches > 0) {
        await examController.logCheatBehavior(req.user.id, examId, exam.title, 
          [`Tab Switch x${tabSwitches}`], tabSwitches * 20);
      }

      res.status(200).json({
        message: 'Exam submitted successfully',
        result,
      });
    } catch (error) {
      console.error('Submit exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async logCheatBehavior(userId, examId, examTitle, violations, initialProbability) {
    try {
      let aiProbability = initialProbability;
      let severity = 'low';

      try {
        const analysisPrompt = `Analyze these exam cheating violations and provide probability (0-100) and severity:
        Violations: ${violations.join(', ')}
        Return JSON with: { probability, severity }`;
        
        const analysis = JSON.parse(await geminiClient.analyzeCheatBehavior(violations));
        aiProbability = analysis.probability || initialProbability;
        severity = analysis.severity || 'low';
      } catch (aiError) {
        console.log('AI cheat analysis skipped');
      }

      const cheatLog = new CheatLog({
        userId,
        examId,
        candidateName: `User ${userId}`,
        examTitle,
        violations,
        aiProbability,
        severity,
      });

      await cheatLog.save();
    } catch (error) {
      console.error('Log cheat behavior error:', error);
    }
  },

  async getResults(req, res) {
    try {
      const results = await Result.find({ userId: req.user.id })
        .populate('examId', 'title difficulty');

      res.status(200).json({
        message: 'Results retrieved',
        results,
      });
    } catch (error) {
      console.error('Get results error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
