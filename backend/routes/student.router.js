const express = require("express");
const router = express.Router();
const {verifyToken, checkRole} = require("../middleware/authMiddleware")
const {addStudent,getStudents, getStudentById, updateStudent, deleteStudent} = require("../controllers/student.controller")


router.post("/add", verifyToken, checkRole(["Admin"]), addStudent)
      .get("/",verifyToken, checkRole(["Admin","Staff"]), getStudents)  
      .get("/:id", verifyToken, checkRole(["Admin","Staff"]), getStudentById)
      .put("/:id", verifyToken, checkRole(["Admin"]), updateStudent)
      .delete("/:id", verifyToken, checkRole(["Admin"]), deleteStudent)

module.exports = router;