import express from 'express';
import { blogController } from '../controllers/blogController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import { blogImageUpload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', verifyToken, authorizeRoles('developer'), blogImageUpload.single('image'), blogController.createBlog);
router.put('/:id', verifyToken, authorizeRoles('developer'), blogController.updateBlog);
router.delete('/:id', verifyToken, authorizeRoles('developer'), blogController.deleteBlog);
router.post('/:id/publish', verifyToken, authorizeRoles('developer'), blogController.publishBlog);

export default router;
