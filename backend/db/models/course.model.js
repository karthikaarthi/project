const mongoose = require("mongoose");

const courseSchema= new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    duration: {
        
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    subjects:[String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Programming',
            'Advanced Programming',
            'Autocadd',
            'Tailoring',
            'Beautician',
            'Typewritting'

        ]

    }
})

const Course = mongoose.model("Course",courseSchema);
module.exports = Course;