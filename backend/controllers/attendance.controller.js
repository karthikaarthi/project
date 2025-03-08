const StudentAttendance = require("../db/models/student.attendance.model")
const errorHandler = require("../utils/errorHandler")
const {sendNotification} = require("../utils/notificationService")
const Student = require("../db/models/student.model")
const User = require("../db/models/user.model")
const {sendWhatsAppMessage} = require("../utils/sendWhatsappMessage")

async function markStudentAttendance (req, res, next) {
try {
    const {studentId, status} = req.body;

    const student = await Student.findById(studentId).populate("user")
    if(!student ) {
        return next(errorHandler(404,"Student not found"))
    }
    const attendance = new StudentAttendance({
        student: studentId,
        status,
        markedBy: req.user.id
    })
    await attendance.save();
    console.log(student.user)

    res.status(201).json({
        message: "Attendance marked successfully"
    })
    if(status === "Absent" && student.user) {
        console.log(" Sending Notification to:", student.user._id);
    console.log(" Sending WhatsApp to:", student.user.phone);
        sendNotification(student.user._id, "You were marked absent today")
        sendWhatsAppMessage(student.user.phone,"You were marked absent today");
    }


}catch(err) {
    next(err);
}
}
async function getStudentAttendance(req, res, next) {
    try {
        const attendance = await StudentAttendance.find().
        populate("student", "name email role")
        .populate("markedBy", "name email role")
        res.status(200).json(attendance)
    }catch(err) {
        next(err);
    }
}

module.exports = {
    markStudentAttendance,
    getStudentAttendance
}