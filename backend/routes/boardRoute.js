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
const router = express.Router();
router.post('/', createBoard);
router.get('/', getAll);
router.put('/', updatePosition);
router.get('/favourites', getFavourites);
router.put('/favourites', updateFavouritePosition);
router.get('/:boardId', getOne);
router.put('/:boardId', update);
router.delete('/:boardId', deleteBoard);




export default router