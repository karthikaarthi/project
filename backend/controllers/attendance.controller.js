const StudentAttendance = require("../db/models/studentAttendance.model");
const errorHandler = require("../utils/errorHandler")
const {sendNotification} = require("../utils/notificationService")
const Student = require("../db/models/student.model")
const User = require("../db/models/user.model")
const {sendWhatsAppMessage} = require("../utils/sendWhatsappMessage")

async function markStudentAttendance (req, res, next) {
try {
    const {student, date, status, markedBy} = req.body;

    if(!student || !date || !status || !markedBy  ) {
        return next(errorHandler(400,"All fields are required"))
    }
    const attendance = await StudentAttendance.findOneAndUpdate(
        { student, date},
        { status, markedBy},
        { upsert: true, new: true, }
    )
    
    const studentData = await Student.findById(student)
    const parentData = studentData.guardian
    if( status !== "prensent" && parentData){
        console.log("Student was absent");
        await sendNotification(student,"You were marked absent today");
        await sendWhatsAppMessage(studentData.mobileNo,"You were marked absent today");
    }
    
   return res.status(200).json({
    message: "Attendance marked successfully",
    data: attendance
    })

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

async function getAttendanceByBatchAndDate ( req, res, next) {
    try {
        const {batchId, date} = req.params;
        console.log(batchId)
        const attendanceRecord = await StudentAttendance.find({
            batchId,
            date: new Date(date),

        }).populate("student", "name ");
        res.status(200).json(attendanceRecord

        )
    } catch(err) {
        next(err);
    }
}


async function getMonthlyReport(req, res, next) {
    try {

        const { month, year } = req.query;

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate + 1);
        endDate.setMonth(endDate.getMonth() + 1);
        const report = await Attendance.aggregate([
            {
                $math: {
                    date: { $gte: startDate, $lt: endDate }
                }
            },
           {
            $group: {
                _id: "$studentId",

                Present : {
                    $sum: { $cond: [{ $eq: ["$status", "Present"]}, 1, 0]}
                },
                Absent: {
                    $sum: { $cond: [{ $eq: ["$status", "Absendt"]}, 1, 0]}
                },
                Late: {
                    $sum: { $cond: [{ $eq: ["$status", "Late"]}, 1, 0]}
                },
                Leave: {
                    $sum: { $cond: [{ $eq: ["$status", "Leave"]}, 1, 0]}
                },
                Permission: {
                    $sum: { $cond: [{$eq: ["$status", "Permission"]}, 1, 0]}
                }
            }
           },
           { 
            $lookup: {
                from: "students",
                localField: "_id",
                foreignField: "_id",
                as: "student"
            }
           },
           {
            $project: {
                studentId: "$_id",
                studentName: "$student.name",
                Present: 1,
                Absent: 1,
                Late: 1,
                Leave: 1,
                Permission: 1
            }
           }

        ])

        res.status(200).json(report)

    } catch(err) {
        next(err);
    }
}
module.exports = {
    markStudentAttendance,
    getStudentAttendance,
    getAttendanceByBatchAndDate,
    getMonthlyReport
}