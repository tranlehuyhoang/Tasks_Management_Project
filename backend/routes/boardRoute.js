import express from 'express';

import {
    createBoard
    , getAll
    , getOne
    , updatePosition
    , update
    , getFavourites
    , updateFavouritePosition
    , deleteBoard
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', protect, createBoard);
router.get('/', protect, getAll);
router.put('/', protect, updatePosition);
router.get('/favourites', protect, getFavourites);
router.put('/favourites', protect, updateFavouritePosition);
router.get('/:boardId', protect, getOne);
router.put('/:boardId', protect, update);
router.delete('/:boardId', protect, deleteBoard);




export default router