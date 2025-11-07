import { geminiClient } from '../utils/geminiClient.js';
import { Result } from '../models/Result.js';
import { CheatLog } from '../models/CheatLog.js';

export const aiController = {
  async resumeFilter(req, res) {
    try {
      const { resumeText } = req.body;

      if (!resumeText) {
        return res.status(400).json({ message: 'Resume text is required' });
      }

      const analysis = await geminiClient.analyzeResume(resumeText);
      const parsed = JSON.parse(analysis);

      res.status(200).json({
        message: 'Resume analyzed',
        analysis: parsed,
      });
    } catch (error) {
      console.error('Resume filter error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async blogSummary(req, res) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const summary = await geminiClient.generateBlogSummary({ title, content });

      res.status(200).json({
        message: 'Blog summary generated',
        summary,
      });
    } catch (error) {
      console.error('Blog summary error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async evaluateExam(req, res) {
    try {
      const { examId, answers, questions } = req.body;

      if (!examId || !answers || !questions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const evaluation = await geminiClient.evaluateExamAnswers(answers, questions);
      const parsed = JSON.parse(evaluation);

      res.status(200).json({
        message: 'Exam evaluated',
        evaluation: parsed,
      });
    } catch (error) {
      console.error('Evaluate exam error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async cheatAnalyze(req, res) {
    try {
      const { violations } = req.body;

      if (!violations || !Array.isArray(violations)) {
        return res.status(400).json({ message: 'Violations array is required' });
      }

      const analysis = await geminiClient.analyzeCheatBehavior(violations);
      const parsed = JSON.parse(analysis);

      res.status(200).json({
        message: 'Cheat behavior analyzed',
        analysis: parsed,
      });
    } catch (error) {
      console.error('Cheat analyze error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }

      const response = await geminiClient.generateContent(message);

      res.status(200).json({
        message: 'Response generated',
        response,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async generateSummary(req, res) {
    try {
      const analyticsData = {
        totalVisitors: req.body.totalVisitors || 0,
        weeklyVisitors: req.body.weeklyVisitors || 0,
        topPages: req.body.topPages || [],
      };

      const summary = await geminiClient.generateAIInsights(analyticsData);

      res.status(200).json({
        message: 'Summary generated',
        summary,
      });
    } catch (error) {
      console.error('Generate summary error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async generateChatbotResponse(req, res) {
    try {
      const { question, context } = req.body;

      if (!question) {
        return res.status(400).json({ message: 'Question is required' });
      }

      const fullPrompt = context 
        ? `${context}\n\nUser Question: ${question}`
        : question;

      console.log('🤖 Chatbot Request:', { question, hasContext: !!context });
      const response = await geminiClient.generateContent(fullPrompt);
      console.log('✅ Gemini Response received');

      res.status(200).json({
        message: 'Chatbot response generated',
        response,
      });
    } catch (error) {
      console.error('❌ Chatbot response error:', error.message);
      console.error('Full error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
