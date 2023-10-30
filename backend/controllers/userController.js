import asyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({

        username,
        password,
    });

    if (user) {
        const token = generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.username,
            token: token
        });

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

})
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.username,
            token: token
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }



});
const getProfileUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ user });


})

export {
    registerUser, authUser, getProfileUser
}