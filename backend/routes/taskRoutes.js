// backend/routes/taskRoutes.js
import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  downloadFile,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

// ✅ Download route FIRST (specific routes before generic ones)
router.get('/:id/files/:filename', downloadFile);

// CRUD routes

router
  .route('/:id')
  .get(getTaskById)
  .put(upload.array('documents', 5), updateTask)
  .delete(deleteTask);

router
  .route('/')
  .post(upload.array('documents', 5), createTask)
  .get(getTasks);


export default router;
