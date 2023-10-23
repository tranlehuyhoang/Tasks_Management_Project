import express from 'express';

import { registerUser, authUser, getProfileUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/auth', authUser);
router.get('/profile', protect, getProfileUser);


export default router