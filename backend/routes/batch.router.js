const express = require("express");
const {createBatch, getAllBatch, getBatchById, updateBatch, deleteBatch, getTotalBatches, getBatchCountByStatus, getAverageStudentsPerBatch, getBatchCountByCourse, getBatchByStaff, toggleBatchNotification, updateBatchProgress, updateBatchStatus}= require("../controllers/batch.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")
const router = express.Router();



router.post("/", verifyToken, checkRole(["Admin"]),createBatch)
      .get("/", verifyToken, checkRole(["Admin", "Staff"]),getAllBatch)  
      .get("/total-batches", verifyToken, checkRole(["Admin", "Staff"]), getTotalBatches)
      .get("/status-summary", verifyToken,  checkRole(["Admin", "Staff"]),  getBatchCountByStatus)
      .get("/average-students", verifyToken, checkRole(["Admin", "Staff"]),  getAverageStudentsPerBatch)
      .get("/by-staff/:staffId", verifyToken, checkRole(["Admin", "Staff"]),  getBatchByStaff)
      .get("/by-course", verifyToken,checkRole(["Admin", "Staff"]),  getBatchCountByCourse)
      .patch("/:id/progress", verifyToken,checkRole(["Admin", "Staff"]),updateBatchProgress)
      .patch("/:id/notifications", verifyToken,checkRole(["Admin", "Staff"]),toggleBatchNotification)
      .get("/:id", verifyToken, checkRole(["Admin", "Staff"]),getBatchById) 
      .put("/:id", verifyToken, checkRole(["Admin"]),updateBatch)
      .put("/:id/status", verifyToken, checkRole(['Admin',"staff"]), updateBatchStatus)
      .delete("/:id",verifyToken, checkRole(["Admin"]), deleteBatch)
module.exports = router        