import mongoose, { Schema } from 'mongoose';

const sectionSchema = mongoose.Schema(
    {
        board: {
            type: Schema.Types.ObjectId,
            ref: 'Board',
            required: true
        },
        title: {
            type: String,
            default: 'Untitled'
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



const Section = mongoose.model('sctions', sectionSchema);

export default Section;