import asyncHandler from 'express-async-handler';

import Board from '../models/boardModel.js';
import Section from '../models/sectionModel.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';


const create = asyncHandler(async (req, res) => {
    const { boardId } = req.params
    let token;
    token = req.query.token.replace(/"/g, '');
    try {
        const section = await Section.create({ board: boardId })
        section._doc.tasks = []
        res.status(201).json(section)
    } catch (err) {
        throw new Error(err)
    }

})
const update = asyncHandler(async (req, res) => {
    const { sectionId } = req.params
    let token;
    token = req.query.token.replace(/"/g, '');
    try {
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { $set: req.body }
        )
        section._doc.tasks = []
        res.status(200).json(section)
    } catch (err) {
        throw new Error(err)
    }

});
const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params
    let token;
    token = req.query.token.replace(/"/g, '');
    try {
        await Task.deleteMany({ section: sectionId })
        await Section.deleteOne({ _id: sectionId })
        res.status(200).json('deleted')
    } catch (err) {
        throw new Error(err)
    }
})

export {
    create, update, deleteSection
}