const express = require("express");
const {createBatch, getAllBatch, getBatchById, updateBatch, deleteBatch }= require("../controllers/batch.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")
const router = express.Router();


router.post("/", verifyToken, checkRole(["Admin"]),createBatch)
      .get("/", verifyToken, checkRole(["Admin", "Staff"]),getAllBatch)  
      .get("/:id", verifyToken, checkRole(["Admin", "Staff"]),getBatchById) 
      .put("/:id", verifyToken, checkRole(["Admin"]),updateBatch)
      .delete("/:id",verifyToken, checkRole(["Admin"]), deleteBatch)
module.exports = router