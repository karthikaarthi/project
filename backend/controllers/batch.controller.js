const Batch = require("../db/models/batch.model");
const Course = require("../db/models/course.model");
const Staff = require("../db/models/staff.model");
const Student = require("../db/models/student.model")
const errorHandler = require("../utils/errorHandler");



async function createBatch(req, res, next) {
    try {
        const { batchName, course, students, staff, schedule, startDate, endDate, notificationEnabled, progress} = req.body;

        const courseExists = await Course.findById(course);
        if(!courseExists) return next(errorHandler(404,"Course not found"));
        console.log(staff)
        const staffExists = await Staff.findById(staff);
        console.log(staffExists)
        if(!staffExists) return next(errorHandler(404,"Staff not found"))
        const newBatch = new Batch({
            batchName,
            course,
            students,
            staff,
            schedule,
            startDate,
            endDate,
            notificationEnabled,
            progress
            
    })

        await newBatch.save();
        res.status(201).json({
            message: true,
            data: {
                batch: newBatch
            }
        })
    }catch(err) {
        next(err);
    }
}


async function getAllBatch(req, res, next) {
    try{

        const { search, course, staff, status, sort } = req.query;
        let filter = {};

        if(search) {
            filter.batchName = { $regex: search, $options: "i"}
        }

        if(course) {
            filter.course = course;
        }

        if(staff) {
            filter.staff = staff;
        }

        if(status) {
            filter.status = status;
        }

        let query = Batch.find(filter).populate("course staff students");

        if(sort === 'az') {
            query = query.sort({batchName: 1});
        }else if(sort === "newest") {
            query = query.sort({createdAt: -1});
        }

        const batches = await query;

        res.status(200).json({
            success: true,
            msg: batches
        })
    
    }catch(err){
        next(err)
    }
}

async function getBatchByStaff (req, res, next) {
    try {
        const { staffId } = req.params;
        const batches = await Batch.find({staff: staffId}).populate("course students");
        res.status(200).json({
            success: true,
            data: batches
        })
    } catch(err) {
        next(err);
    }
}

async function getBatchById (req, res, next) {
    try {

        const batch = await Batch.findById(req.params.id).populate("course students staff");
        if(!batch) return next(errorHandler(404,"Batch not found"))
        res.status(200).json({
            success: true,
            branch: batch
        })
    }catch(err) {
        next(err);
    }
}

async function updateBatch(req, res, next) {
    try {
        const updatedBatch = await Batch.findByIdAndUpdate(req.params.id, req.body, {new: true} );
        if(!updatedBatch) return next(errorHandler(404, "Batch not found"))
        res.status(200).json({
            success: true,
            updateBatch: updatedBatch
        })
    }catch(err) {
        next(err);
    }
}

async function deleteBatch (req, res, next) {
    try{
        const deletedBatch = await Batch.findByIdAndDelete(req.params.id);
        if(!deletedBatch) return next(errorHandler(404,"Batch not found"));
        res.status(200).json({})
    }catch(err){
        next(err);
    }
}


async function getTotalBatches(req, res,  next) {
    try {
        const totalBatches = await Batch.aggregate([
            {
                $count: "totalBatches"
            }
        ])
        const total = totalBatches.length>0? totalBatches[0].totalBatches:0;
        res.status(200).json({
            success: true,
            data: total
        })
    } catch(err) {
        next(err);
    }
}



async function getBatchCountByStatus(req, res, next ) {
    try {
         const statusSummary = await Batch.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum: 1 }
                }
            }
         ])

         res.status(200).json({
            success: true,
            data: statusSummary
         })
    } catch(err) {
        next(err);
    }
}

async function getAverageStudentsPerBatch(req, res, next) {
    try {
        const result = await Batch.aggregate([
            {
                $project: {
                    studentCount : {$size: "$students"}
                }
            },
            {
                $group: {
                    _id: null,
                    avgStudents: {$avg: "$studentCount"}
                }
            }
        ])
        res.status(200).json({
            success: true,
            average: result.length > 0?result[0].avgStudents : 0

        })
    } catch(err) {
        next(err);
    }
}

async function getBatchCountByCourse ( req, res, next ) {
    try {
        const result = await Batch.aggregate([
            {
                $group: {
                    _id: "$course",
                    totalBatches : {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            {
                $unwind: "$courseInfo"
            },
            {
                $project: {
                    _id: 0,
                    courseName: "$courseInfo.courseName",
                    totalBatches: 1
                }
            }
        ])
        res.status(200).json({
            success: true,
            data: result
        })
    } catch(err) {
        next(err);
    }
}

async function updateBatchProgress (req, res, next) {
    try {
        const {progress} = req.body;

        if(progress < 0 || progress > 100) {
            return next(errorHandler(400,"Progress must be between 0 and 100"));
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id,
            {progress},
            {new: true}
        );

        if(!updatedBatch) {
            return next(errorHandler(404,"Batch not found"));
        }

        res.status(200).json(updatedBatch)
    } catch(err) {
        next(err);
    }
}

async function toggleBatchNotification ( req, res, next ) {
    try {
        const batch = await Batch.findById(req.params.id);

        if(!batch) {
            return next(errorHandler(404,"Batch not found"));
        }

        batch.notificationEnabled = !batch.notificationEnabled;
        await batch.save();
        
        res.status(200).json({
            message: `Notifications ${batch.notificationEnabled? "enabled": "disabled"}`,
            batch
        })
    } catch(err) {
        next(err);
    }
}


async function updateBatchStatus (req, res, next) {
     try {

        const { status } = req.body;
        const batch = await Batch.findById(req.params.id);
        batch.status = status;
        await batch.save();
        res.status(200).json({
            message: "status updated"
        })
     } catch(err) {
        next(err);
     }
}
module.exports = {
    createBatch,
    getAllBatch,
    getBatchById,
    updateBatch,
    deleteBatch,
    getTotalBatches,
    getBatchCountByStatus,
    getAverageStudentsPerBatch,
    getBatchCountByCourse,
    getBatchByStaff,
    updateBatchProgress,
    toggleBatchNotification,
    updateBatchStatus
}