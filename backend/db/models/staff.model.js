const mongoose = require("mongoose");

const staffAttendanceSchema = mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    inTime: {
        type: Date,
        required: true,
    },
    outTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum : ['Pending', "Approved", "Rejected"],
        default: "Pending",

    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default : Date.now
    }
})

const StaffAttendance = mongoose.model("StaffAttendance",staffAttendanceSchema);
module.exports = StaffAttendance