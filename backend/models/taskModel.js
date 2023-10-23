import mongoose, { Schema } from 'mongoose';


const taskSchema = mongoose.Schema(
    {
        section: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: true
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        position: {
            type: Number
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



const Task = mongoose.model('tasks', taskSchema);

export default Task;