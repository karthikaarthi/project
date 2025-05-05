const express = require("express");
const router = express.Router();
const {markStudentAttendance, getStudentAttendance, getAttendanceByBatchAndDate, getMonthlyReport} = require("../controllers/attendance.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")

router.post("/mark-student-attendance", verifyToken, checkRole(["Admin", "staff"]), markStudentAttendance)
      .get("/student-report" , verifyToken, checkRole(["Admin", "staff"]),getAttendanceByBatchAndDate)  
      .get("/:batchId/:date" , verifyToken, checkRole(["Admin", "staff"]),getAttendanceByBatchAndDate)  
      .get("/report/monthly", verifyToken, checkRole(["Admin", "staff"]), getMonthlyReport)

      
module.exports = router
