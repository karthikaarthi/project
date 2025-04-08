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
    }
})

const Course = mongoose.model("Course",courseSchema);
module.exports = Course;