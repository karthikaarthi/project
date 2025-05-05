const Staff = require("../db/models/staff.model");
const User = require("../db/models/user.model");
const errorHandler = require("../utils/errorHandler");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const generateOTP = () => Math.floor(1000+Math.random()*900000).toString();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  

  async function addStaff(req, res, next) {
    try {
      const { email, password, name, phone, department, salary } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return next(errorHandler(400, "Email already exists"));
  
      const existingPhone = await Staff.findOne({ phone });
      if (existingPhone) return next(errorHandler(400, "Phone already exists"));
  
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        role: "Staff",
        otp,
        otpExpires
      });
  
      await newUser.save();
  
      const newStaff = new Staff({
        // userId: newUser._id,
        name,
        phone,
        department,
        salary
      });
  
      await newStaff.save();
  
      // Send OTP Email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Your Staff Account OTP Verification",
        text: `Welcome ${name},\n\nYour OTP is ${otp}. It is valid for 10 minutes.`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(201).json({
        success: true,
        message: "Staff added successfully. OTP sent to email.",
        data: {
          staff: newStaff,
          user: newUser
        }
      });
  
    } catch (err) {

      
      next(err);
    }
  }
  
async function getAllStaff(req, res, next) {
  try {
    const staffList = await Staff.find();
    res.status(200).json({ success: true, data: staffList });
  } catch (err) {
    next(err);
  }
}

async function getStaffById(req, res, next) {
  try {
    const staff = await Staff.findById(req.params.id).populate("userId");
    if (!staff) return next(errorHandler(404, "Staff not found"));
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
};
