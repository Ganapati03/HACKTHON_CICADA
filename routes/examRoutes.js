import express from 'express';
import { examController } from '../controllers/examController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);
router.post('/', verifyToken, authorizeRoles('examiner'), examController.createExam);
router.put('/:id', verifyToken, authorizeRoles('examiner'), examController.updateExam);
router.delete('/:id', verifyToken, authorizeRoles('examiner', 'developer'), examController.deleteExam);
router.post('/:id/submit', verifyToken, examController.submitExam);
router.get('/user/results', verifyToken, examController.getResults);

export default router;
