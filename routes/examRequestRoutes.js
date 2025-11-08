import express from 'express';
import { examRequestController } from '../controllers/examRequestController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// HR creates request
router.post('/', verifyToken, authorizeRoles('hr'), examRequestController.createRequest);

// Get all requests (for examiners and HR)
router.get('/', verifyToken, authorizeRoles('hr', 'examiner', 'developer'), examRequestController.getAllRequests);

// Examiner accepts/rejects request
router.post('/:requestId/accept', verifyToken, authorizeRoles('examiner'), examRequestController.acceptRequest);
router.post('/:requestId/reject', verifyToken, authorizeRoles('examiner'), examRequestController.rejectRequest);

// Link exam to request
router.post('/link-exam', verifyToken, authorizeRoles('examiner'), examRequestController.linkExamToRequest);

// Delete request
router.delete('/:id', verifyToken, authorizeRoles('hr', 'developer'), examRequestController.deleteRequest);

export default router;
