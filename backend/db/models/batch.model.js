const mongoose = require("mongoose");

const batchSchema = new  mongoose.Schema({
    batchName: {
        type: String,
        required: true
    },
    course: {
  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    schedule: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Batch = mongoose.model("Batch",batchSchema);
module.exports = Batch;

