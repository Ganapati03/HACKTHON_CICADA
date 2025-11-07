import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/resume-filter', aiController.resumeFilter);
router.post('/blog-summary', aiController.blogSummary);
router.post('/evaluate', aiController.evaluateExam);
router.post('/cheat-analyze', aiController.cheatAnalyze);
router.post('/chat', aiController.chat);
router.post('/summary', aiController.generateSummary);
router.post('/chatbot', aiController.generateChatbotResponse);

export default router;
