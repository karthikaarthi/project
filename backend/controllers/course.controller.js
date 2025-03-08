const Course = require("../db/models/course.model");
const errorHandler = require("../utils/errorHandler");


async function createCourse( req, res, next) {
try {
    const {courseName, duration, fees} = req.body;

    const newCourse = new Course({courseName, duration, fees })
    await newCourse.save();
    res.status(201).json({
        msg: "Course created successfully"
    })
}catch(err) {
    next(err);
}
}

async function getAllCourses (req, res, next) {
    try {
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            data: {
                courses: courses
            }
        })
    }catch(err) {
        next(err);
    }
}

async function getCourseById (req, res, next) {

    try {
        const course =  await Course.findById(req.params.id);
        console.log()
        if(!course) return next(errorHandler(404,"Course not found"))
        return res.status(404).json({
                success: true,
                data: {
                    course: course
                }
            })
        
    }catch(err) {
        next(err);
    }
}

async function updateCourse(req, res, next) {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(! updatedCourse) return next(errorHandler(404, "Course not found"))
        res.status(200).json({
            success: true,
            data: {
                updatedCourse: updatedCourse
            }
    })
    } catch(err) {
        next(err);
    }
}

async function deleteCourse (req, res, next) {
    try {
       const deletedCourse = await Course.findByIdAndDelete(req.params.id);
       if(!deletedCourse) return next(errorHandler(404, "Course not found"));
       res.status(200).json({
        success: "Course deleted successfully"
       })
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
}