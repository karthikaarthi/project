const mongoose = require("mongoose");

const StudentAttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        require: true
    },
    markedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

const StudentAttendance = mongoose.model("StudentAttendance", StudentAttendanceSchema);
module.exports = StudentAttendance;