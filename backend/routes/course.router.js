const express  = require("express")
const router = express.Router();
const {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, getTotalCourses, getCourseWithStudentCount, getPopularCourses, getAverageEntrollment} = require("../controllers/course.controller")
const {verifyToken,checkRole} = require("../middleware/authMiddleware")
router.post("/",verifyToken, checkRole(["Admin"]), createCourse)
      .get("/", verifyToken, checkRole(["Admin","Staff"]), getAllCourses) 
      .get("/total-courses",getTotalCourses)
      .get("/courses-with-students", getCourseWithStudentCount)
      .get("/popular-courses", getPopularCourses)
      .get("/average-entrollment", getAverageEntrollment)
      .get("/:id", verifyToken, checkRole(["Admin", "Staff"]), getCourseById) 
      .put("/:id", verifyToken, checkRole(["Admin"]), updateCourse)
      .delete("/:id", verifyToken, checkRole(["Admin"]), deleteCourse)
      
module.exports = router