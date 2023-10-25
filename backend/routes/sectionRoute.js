import express from 'express';

import { create, update, deleteSection } from '../controllers/sectionController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/:boardId', protect, create);
router.put('/:sectionId', protect, update);
router.delete('/:sectionId', protect, deleteSection);



export default router