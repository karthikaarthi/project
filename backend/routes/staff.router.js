const express = require("express");
const router = express.Router();
const {createStaff, getAllStaff, getStaffId, updateStaff, deleteStaff} = require("../controllers/staff.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware");
router.post ('/create',verifyToken, checkRole(['Admin']),  createStaff)
      .get("/", verifyToken, checkRole(['Admin']), getAllStaff)  
      .get("/:id", verifyToken, checkRole(['Admin']), getStaffId)
      .patch("/:id", verifyToken, checkRole(['Admin']), updateStaff)
      .delete("/:id", verifyToken, checkRole(['Admin']), deleteStaff)
module.exports = router;