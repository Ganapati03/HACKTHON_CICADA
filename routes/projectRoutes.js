import express from 'express';
import { projectController } from '../controllers/projectController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import { projectImageUpload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', projectController.getProjects);
router.get('/admin/all', verifyToken, authorizeRoles('hr'), projectController.getAllProjectsForAdmin);
router.get('/:id', projectController.getProjectById);
router.post('/', verifyToken, authorizeRoles('hr'), projectImageUpload.single('image'), projectController.createProject);
router.put('/:id', verifyToken, authorizeRoles('hr'), projectController.updateProject);
router.delete('/:id', verifyToken, authorizeRoles('hr'), projectController.deleteProject);

export default router;
