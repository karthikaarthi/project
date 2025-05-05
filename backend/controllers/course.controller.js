const Course = require("../db/models/course.model");
const errorHandler = require("../utils/errorHandler");


async function createCourse( req, res, next) {
try {
    const {courseName, duration, fees, subjects,category} = req.body;

    const newCourse = new Course({courseName, duration, fees, subjects ,category})
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


async function getTotalCourses (req, res, next){
    try {
        const totalCourses = await Course.aggregate([
            {$count: "totalCourses"}
        ]);
        const total = totalCourses.length > 0 ? totalCourses[0].totalCourses : 0;
        res.status(200).json({data:total})
    }catch(err) {
        next(err);
    }
}

async function getCourseWithStudentCount(req, res, next ) {
    try {
        const courseWithStudents = await Course.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "courseId",
                    as: "enrolledStudents"
                }
            },
            {
                $project: {
                    courseName: 1,
                    totalStudents: {$size: "$enrolledStudents"}
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: courseWithStudents
        })
    } catch(err) {
        next( err );
    }
}


async function getPopularCourses (req, res ) {
    try {
        const popularCourses = await Course.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField : "_id",
                    foreignField: "courseId",
                    as: "students"
                }
            },
            {
                $project: {
                    courseName: 1,
                    totalStudents: {$size: "$students"}

                }
            },
            { $sort: { totalStudents: -1 } } 
        ]);

        res.status(200).json({
            success: true,
            data: popularCourses
        })
    } catch(err) {
        next(err);
    }
}

async function getAverageEntrollment(req,res, next) {
    try {

        const avgEntrollment = await Course.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "courseId",
                    as: "students"
                }
               
            },
            {
                $group: {
                    _id: null,
                    avgEntrollment: {$avg: {$size: "$students"}}
                }
            }
        ])
        // const average = avgEntrollment.length >0 ? avgEntrollment[0].avgEntrollment: 0;
        
        res.status(200).json({
            success: true,
            avgEntrollment:avgEntrollment
        })
    } catch(err) {
        next(err);
    }
}



async function getCoursesByCategory (req, res, next) {
    try {
        const category = req.params.category;
        console.log(category);
        const courses = await Course.find({category});
        res.status(200).json(courses);

    } catch(err) {
        next(err);
    }
}

module.exports = {
    
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getTotalCourses,
    getCourseWithStudentCount,
    getPopularCourses,
    getAverageEntrollment,
    getCoursesByCategory
}