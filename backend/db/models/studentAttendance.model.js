const mongoose = require("mongoose");

const StudentAttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true,
    }
    ,
    date: {
        type: Date,
        // default: Date.now
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        required: true
    },
    markedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

StudentAttendanceSchema.index({student: 1,batchId: 1, date: 1},{ unique: true});


const StudentAttendance = mongoose.model("StudentAttendance", StudentAttendanceSchema);
module.exports = StudentAttendance;