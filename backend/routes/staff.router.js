const express = require("express");
const router = express.Router();
const {addStaff, getAllStaff, getStaffById, updateStaff, deleteStaff} = require("../controllers/staff.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware");
router.post ('/', verifyToken, checkRole(['Admin']),  addStaff)
      .get("/", verifyToken, checkRole(['Admin']), getAllStaff)  
      .get("/:id", verifyToken, checkRole(['Admin']), getStaffById)
      .patch("/:id", verifyToken, checkRole(['Admin']), updateStaff)
      .delete("/:id", verifyToken, checkRole(['Admin']), deleteStaff)
      
module.exports = router;