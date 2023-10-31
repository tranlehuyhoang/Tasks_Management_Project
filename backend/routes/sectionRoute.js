import express from 'express';

import { create, update, deleteSection } from '../controllers/sectionController.js';
const router = express.Router();
router.post('/:boardId', create);
router.put('/:sectionId', update);
router.delete('/:sectionId', deleteSection);



export default router