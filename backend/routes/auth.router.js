const express = require("express");
const router = express.Router();
const { login, logOut, verifyOTP, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const {verifyToken, checkRole} = require("../middleware/authMiddleware")

          
          
router.post('/login', login)
      .get('/logout', verifyToken, logOut)
      .post("/verifyOTP", verifyOTP)
      .post('/forgot-password', forgotPassword)
      .post('/reset-password', resetPassword)

module.exports = router;



