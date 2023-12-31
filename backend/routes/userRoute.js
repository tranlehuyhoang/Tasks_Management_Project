import express from 'express';

import { registerUser, authUser, getProfileUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/auth', authUser);



export default router