import asyncHandler from 'express-async-handler';

import Board from '../models/boardModel.js';
import Section from '../models/sectionModel.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';



const createBoard = asyncHandler(async (req, res) => {
    console.log('createBoard')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    try {
        const boardsCount = await Board.find().count()
        const board = await Board.create({
            user: token,
            position: boardsCount > 0 ? boardsCount : 0
        })
        res.status(201).json(board)
    } catch (err) {
        throw new Error(err)
    }


})
const getAll = asyncHandler(async (req, res) => {
    console.log('getAll')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)

    try {
        const boards = await Board.find({ user: token }).sort('-position')
        res.status(200).json(
            boards
        )
    } catch (err) {
        throw new Error(err)
    }

})
const getOne = asyncHandler(async (req, res) => {
    console.log('getOne')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    const { boardId } = req.params
    try {
        const board = await Board.findOne({ user: token, _id: boardId })
        if (!board) return res.status(404).json('Board not found')
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
            section._doc.tasks = tasks
        }
        board._doc.sections = sections
        res.status(200).json(board)
    } catch (err) {
        throw new Error(err)
    }

})
const updatePosition = asyncHandler(async (req, res) => {
    console.log('updatePosition')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    const { boards } = req.body
    try {
        for (const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }
        res.status(200).json('updated')
    } catch (err) {
        throw new Error(err)
    }

})
const update = asyncHandler(async (req, res) => {
    console.log('update')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    const { boardId } = req.params
    const { title, description, favourite } = req.body

    try {
        if (title === '') req.body.title = 'Untitled'
        if (description === '') req.body.description = 'Add description here'
        const currentBoard = await Board.findById(boardId)
        if (!currentBoard) return res.status(404).json('Board not found')

        if (favourite !== undefined && currentBoard.favourite !== favourite) {
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId }
            }).sort('favouritePosition')
            if (favourite) {
                req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
            } else {
                for (const key in favourites) {
                    const element = favourites[key]
                    await Board.findByIdAndUpdate(
                        element.id,
                        { $set: { favouritePosition: key } }
                    )
                }
            }
        }

        const board = await Board.findByIdAndUpdate(
            boardId,
            { $set: req.body }
        )
        res.status(200).json(board)
    } catch (err) {
        throw new Error(err)
    }

})
const getFavourites = asyncHandler(async (req, res) => {
    console.log('getFavourites')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    try {
        const favourites = await Board.find({
            user: token,
            favourite: true
        }).sort('-favouritePosition')
        res.status(200).json(favourites)
    } catch (err) {
        throw new Error(err)
    }

})
const updateFavouritePosition = asyncHandler(async (req, res) => {
    console.log('updateFavouritePosition')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    const { boards } = req.body
    try {
        for (const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { favouritePosition: key } }
            )
        }
        res.status(200).json('updated')
    } catch (err) {
        throw new Error(err)
    }

})
const deleteBoard = asyncHandler(async (req, res) => {
    console.log('deleteBoard')
    let token;
    token = req.query.token.replace(/"/g, '');
    console.log(token)
    const { boardId } = req.params
    try {
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            await Task.deleteMany({ section: section.id })
        }
        await Section.deleteMany({ board: boardId })

        const currentBoard = await Board.findById(boardId)

        if (currentBoard.favourite) {
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId }
            }).sort('favouritePosition')

            for (const key in favourites) {
                const element = favourites[key]
                await Board.findByIdAndUpdate(
                    element.id,
                    { $set: { favouritePosition: key } }
                )
            }
        }

        await Board.deleteOne({ _id: boardId })

        const boards = await Board.find().sort('position')
        for (const key in boards) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }

        res.status(200).json('deleted')
    } catch (err) {
        throw new Error(err)
    }
})



export {
    createBoard
    , getAll
    , getOne
    , updatePosition
    , update
    , getFavourites
    , updateFavouritePosition
    , deleteBoard
}