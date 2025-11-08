import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/track', analyticsController.trackVisitor);
router.get('/dashboard', verifyToken, authorizeRoles('developer'), analyticsController.getDashboard);
router.get('/summary', verifyToken, authorizeRoles('developer'), analyticsController.getSummary);

export default router;
