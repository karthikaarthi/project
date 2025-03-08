const express = require("express");
const router = express.Router();
const {registerStudent, login, logOut, createAdmin, registerStaff} = require("../controllers/auth.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")

router.post('/register-student', verifyToken, checkRole(["Admin"]), registerStudent)
      .post('/register-staff', verifyToken, checkRole(["Admin"]), registerStaff)
      .post("/create-admin",verifyToken,checkRole(["Admin"]), createAdmin)
      .post("/login", login)  
      .get("/logout", logOut)
      
module.exports = router;
