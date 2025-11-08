import express from 'express';
import { applicationController } from '../controllers/applicationController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import { resumeUpload } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/', resumeUpload.single('resume'), applicationController.createApplication);
router.get('/', verifyToken, applicationController.getApplications);
router.get('/all', verifyToken, authorizeRoles('hr'), applicationController.getAllApplications);
router.get('/:id', verifyToken, applicationController.getApplicationById);
router.put('/:id/status', verifyToken, authorizeRoles('hr'), applicationController.updateApplicationStatus);

export default router;
