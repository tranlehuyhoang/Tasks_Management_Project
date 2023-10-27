import express from 'express';

import {
    createTask
    , updateTask
    , deleteTask
    , updatePosition
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', createTask);
router.put('/update-position', updatePosition);
router.delete('/:taskId', deleteTask);
router.put('/:taskId', updateTask);


export default router