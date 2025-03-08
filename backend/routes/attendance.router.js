const express = require("express");
const router = express.Router();
const {markStudentAttendance, getStudentAttendance} = require("../controllers/attendance.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")

router.post("/mark-student-attendance",verifyToken, checkRole(["Staff", "Admin"]), markStudentAttendance)
      .get("/student-report", verifyToken, checkRole(["Admin"]) ,getStudentAttendance)  
module.exports = router