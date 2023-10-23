import asyncHandler from 'express-async-handler';

import Board from '../models/boardModel';
import Section from '../models/sectionModel';
import Task from '../models/taskModel';
import User from '../models/userModel.js';


const create = asyncHandler(async (req, res) => {
    const { boardId } = req.params
    try {
        const section = await Section.create({ board: boardId })
        section._doc.tasks = []
        res.status(201).json(section)
    } catch (err) {
        res.status(500).josn(err)
    }

})
const update = asyncHandler(async (req, res) => {
    const { sectionId } = req.params
    try {
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { $set: req.body }
        )
        section._doc.tasks = []
        res.status(200).json(section)
    } catch (err) {
        res.status(500).josn(err)
    }

});
const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params
    try {
        await Task.deleteMany({ section: sectionId })
        await Section.deleteOne({ _id: sectionId })
        res.status(200).json('deleted')
    } catch (err) {
        res.status(500).josn(err)
    }
})

export {
    create, update, deleteSection
}