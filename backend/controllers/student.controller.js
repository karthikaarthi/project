
const Student = require("../db/models/student.model")
const errorHandler = require("../utils/errorHandler")
const User = require("../db/models/user.model")
async function addStudent(req, res, next) {
    try{
        const {user } = req.body;
        const userExists= await User.findById(user)
        console.log(userExists)
        if(!userExists || userExists.role !== "Student"){
            return next(errorHandler(404,"Student user not found "))
        }

        const existingStudent = await Student.findOne({user: user })
        if(existingStudent){
            return next(errorHandler(400,"Student profile is already exists"))
        }
        const newStudent = new Student (req.body);
        await newStudent.save();
        res.status(201).json({
            success: true,
            message: "student added successfully"
        })

        
    }catch(err) {
        next(err);
    }
}


async function getStudents (req, res, next){
    try {
       const students = await Student.find();
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
        const student = await Student.findById(req.params.id)
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
module.exports = {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
}