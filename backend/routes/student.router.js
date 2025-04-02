const express = require("express");
const router = express.Router();
const {verifyToken, checkRole} = require("../middleware/authMiddleware")
const {addStudent,getStudents, getStudentById, updateStudent, deleteStudent, getTotalStudents, getStudentsWithCourses,getStudentsByCourse} = require("../controllers/student.controller")

router.post("/add",verifyToken, checkRole(["Admin"]), addStudent)
      .get("/total-students",getTotalStudents)
      .get("/students-by-course",getStudentsByCourse)
      // .get("/average-age")
      .get("/students-with-courses", getStudentsWithCourses)
      .get("/",verifyToken, checkRole(["Admin","Staff"]), getStudents)  
      .get("/:id", verifyToken, checkRole(["Admin","Staff"]), getStudentById)
      .put("/:id", verifyToken, checkRole(["Admin"]), updateStudent)
      .delete("/:id", verifyToken, checkRole(["Admin"]), deleteStudent)


      
module.exports = router;