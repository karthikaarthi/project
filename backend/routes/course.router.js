const express  = require("express")
const router = express.Router();
const {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, getTotalCourses, getCourseWithStudentCount, getPopularCourses, getAverageEntrollment} = require("../controllers/course.controller")
const {verifyToken,checkRole} = require("../middleware/authMiddleware")
router.post("/",verifyToken, checkRole(["Admin"]), createCourse)
      .get("/", verifyToken, checkRole(["Admin","Staff", "Student"]), getAllCourses) 
      .get("/total-courses", verifyToken, checkRole(["Admin", "Staff","Student" ]),getTotalCourses)
      .get("/courses-with-students", verifyToken, checkRole(["Admin", "Staff","Student" ]), getCourseWithStudentCount)
      .get("/popular-courses", verifyToken, checkRole(["Admin", "Staff","Student" ]), getPopularCourses)
      .get("/average-entrollment", verifyToken, checkRole(["Admin", "Staff","Student" ]), getAverageEntrollment)
      .get("/:id", verifyToken, checkRole(["Admin", "Staff","Student" ]), getCourseById) 
      .put("/:id", verifyToken, checkRole(["Admin"]), updateCourse)
      .delete("/:id", verifyToken, checkRole(["Admin"]), deleteCourse)
      
module.exports = router