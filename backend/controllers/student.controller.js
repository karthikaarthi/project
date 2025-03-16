
const Student = require("../db/models/student.model")
const errorHandler = require("../utils/errorHandler")
const User = require("../db/models/user.model")
const nodemailer = require("nodemailer");
require('dotenv').config();
const bycrypt = require("bcryptjs")

const generateOTP = () => Math.floor(1000 + Math.random()*900000).toString();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})




async function addStudent(req, res, next) {
    try{

        const {regNo, name, dateOfBirth, mobileNo, gender, occupation, email, guardian, address, applyingFor, education, officeUse}= req.body;

        const userExists = await User.findOne({email })
        if(userExists){
            return next(errorHandler(400,"Email already exists"))
        }

        const otp = generateOTP();
        const otpExpires = Date.now()+10*60*1000;

        const newUser = new User({
            email,
            otp,
            otpExpires,
            role:"Student",
            parentEmail: guardian.parentEmail
        })

        newUser.save();
    // const newStudent = new Student ({
    //     user: newUser._id,
    //     regNo,
    //     name,
    //     dateOfBirth,
    //     mobileNo,
    //     gender,
    //     occupation,
    //     email,
    //     guardian,
    //     address,
    //     applyingFor,
    //     education,
    //     officeUse

    // });
    const newStudent =new Student(req.body)

    await newStudent.save();

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to:email,
        subject: "Your OTP for Account Activation",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`
    }

    transporter.sendMail(mailOptions);
        res.status(201).json({
            success: true,
            message: "student added successfully",
            data: {
                student: newStudent,
                user: newUser
            }
        })

         
    }catch(err) {
        next(err);
    }
}

async function getStudents (req, res, next){
    try {
       const students = await Student.find().populate('user');
       res.status(200).json({
        success: true,
        data: {
            user: students
        }
       })
    }catch(err) {
        next (err);
    }
}


async function getStudentById(req, res, next) {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return next(errorHandler(404,"Student not found"))
        res.status(200).json({
            success: true,
            data: {
                user: student
            }
    })
    }catch(err) {
        next(err);
    }
}

async function updateStudent(req, res, next) {
    try{
        const updatedStudent =await Student.findByIdAndUpdate(req.params.id, req.body,{new:true})
        if(!updatedStudent) return res.status(404).json({msg:"Student not found"})
        res.status(200).json({
            success: true,
            data: {
                user: updatedStudent
            }
        })
    } catch(err) {
        next(err);
    }
}

async function deleteStudent(req, res, next) {
    try{
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if(!deletedStudent) return next(errorHandler(404,"Student not found"));

        res.status(200).json({
            success: true,
            data: {
                
            }
        })


    }catch(err) {
        next(err)
    }
}

async function studentDashboard(req, res, next) {
    res.status(200).json({
        message: "Welcome to Student"
    })
}

module.exports = {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    studentDashboard,
}