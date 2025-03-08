const express  = require("express")
const router = express.Router();
const {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse} = require("../controllers/course.controller")
const {verifyToken,checkRole} = require("../middleware/authMiddleware")
router.post("/",verifyToken, checkRole(["Admin"]), createCourse)
      .get("/", verifyToken, checkRole(["Admin","Staff"]), getAllCourses) 
      .get("/:id", verifyToken, checkRole(["Admin", "Staff"]), getCourseById) 
      .put("/:id", verifyToken, checkRole(["Admin"]), updateCourse)
      .delete("/:id", verifyToken, checkRole(["Admin"]), deleteCourse)
module.exports = router