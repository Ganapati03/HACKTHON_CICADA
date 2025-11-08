import express from 'express';
import { jobController } from '../controllers/jobController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', jobController.getAllJobs);
router.get('/stats', jobController.getJobStats);
router.get('/:id', jobController.getJobById);
router.post('/', verifyToken, authorizeRoles('hr'), jobController.createJob);
router.put('/:id', verifyToken, authorizeRoles('hr'), jobController.updateJob);
router.delete('/:id', verifyToken, authorizeRoles('hr'), jobController.deleteJob);

export default router;
