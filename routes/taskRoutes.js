import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, authorizeRoles('hr', 'examiner', 'developer'), taskController.createTask);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);
router.get('/stats', verifyToken, taskController.getTaskStats);

export default router;
