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
      console.log('📝 Creating exam...');
      console.log('Request body:', req.body);
      const { title, description, duration, difficulty, questions } = req.body;

      if (!title || !description || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let generatedQuestions = questions || [];

      // Generate questions with AI if not provided
      if (!questions) {
        try {
          const prompt = `Generate exactly 5 multiple choice questions for a ${difficulty || 'intermediate'} level exam on: "${title}"

Description: ${description}

IMPORTANT: Generate MCQ questions with FULL answer text (not just "Option A", "Option B").

Format each question exactly like this example:

Q1. What does the dotenv package do in a Node.js project?

A) It encrypts sensitive data  

B) It loads environment variables from a .env file into process.env  

C) It connects to external APIs securely  

D) It manages user authentication

Return response as JSON array:
[
  {
    "id": 1,
    "question": "What does the dotenv package do in a Node.js project?",
    "options": [
      "It encrypts sensitive data",
      "It loads environment variables from a .env file into process.env",
      "It connects to external APIs securely",
      "It manages user authentication"
    ],
    "correctAnswer": 1
  }
]

Generate 5 questions with complete, detailed answer options. Return ONLY valid JSON array. No markdown.`;
          
          console.log('🤖 Generating exam questions with Gemini AI...');
          const aiResponse = await geminiClient.generateContent(prompt);
          console.log('📝 AI Response:', aiResponse);
          
          // Clean the response - remove markdown code blocks if present
          let cleanedResponse = aiResponse.trim();
          if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
          }
          
          generatedQuestions = JSON.parse(cleanedResponse);
          console.log('✅ Generated questions:', generatedQuestions.length);
          
          if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
            throw new Error('Invalid AI response format');
          }
        } catch (aiError) {
          console.error('❌ AI question generation error:', aiError);
          // Fallback: Create default questions
          generatedQuestions = [
            {
              id: 1,
              question: `What is the main concept of ${title}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0,
            },
            {
              id: 2,
              question: `Which statement about ${title} is correct?`,
              options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
              correctAnswer: 1,
            },
            {
              id: 3,
              question: `How would you apply ${title} in practice?`,
              options: ['Method A', 'Method B', 'Method C', 'Method D'],
              correctAnswer: 2,
            },
            {
              id: 4,
              question: `What is a key benefit of ${title}?`,
              options: ['Benefit A', 'Benefit B', 'Benefit C', 'Benefit D'],
              correctAnswer: 0,
            },
            {
              id: 5,
              question: `Which best describes ${title}?`,
              options: ['Description A', 'Description B', 'Description C', 'Description D'],
              correctAnswer: 1,
            },
          ];
          console.log('⚠️ Using fallback questions');
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

  async deleteExam(req, res) {
    try {
      const exam = await Exam.findByIdAndDelete(req.params.id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Also delete related results
      await Result.deleteMany({ examId: req.params.id });

      res.status(200).json({
        message: 'Exam deleted successfully',
      });
    } catch (error) {
      console.error('Delete exam error:', error);
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
