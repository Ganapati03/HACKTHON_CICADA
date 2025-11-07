import express from 'express';
import { emailController } from '../controllers/emailController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/contact', emailController.sendContactEmail);
router.post('/application-status', verifyToken, authorizeRoles('hr'), emailController.sendApplicationStatusEmail);
router.post('/bulk', verifyToken, authorizeRoles('hr'), emailController.sendBulkEmail);
router.post('/custom', verifyToken, authorizeRoles('developer', 'hr'), emailController.sendCustomEmail);

export default router;
