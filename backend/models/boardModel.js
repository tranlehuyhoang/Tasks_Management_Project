import mongoose, { Schema } from 'mongoose';

const boardSchema = mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        icon: {
            type: String,
            default: '📃'
        },
        title: {
            type: String,
            default: 'Untitled'
        },
        description: {
            type: String,
            default: `Add description here
            🟢 You can add multiline description
            🟢 Let's start...`
        },
        position: {
            type: Number
        },
        favourite: {
            type: Boolean,
            default: false
        },
        favouritePosition: {
            type: Number,
            default: 0
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamp: true
    }
);



const Board = mongoose.model('boards', boardSchema);

export default Board;