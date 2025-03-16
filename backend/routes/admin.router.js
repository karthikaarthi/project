const express = require("express");
const router = express.Router();
const {  createAdmin, adminDashboard} = require("../controllers/admin.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")

          
          
router.post ('/admin/register', createAdmin)
      .get('/admin/dashboard', verifyToken, checkRole(['Admin']), adminDashboard)
module.exports = router;

