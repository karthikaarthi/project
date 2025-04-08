const Batch = require("../db/models/batch.model");
const Course = require("../db/models/course.model");
const User = require("../db/models/user.model");
const Student = require("../db/models/student.model")
const errorHandler = require("../utils/errorHandler");


async function createBatch(req, res, next) {
    try {
        const { batchName, course, students, staff, schedule, startDate, endDate} = req.body;

        const courseExists = await Course.findById(course);
        if(!courseExists) return next(errorHandler(404,"Course not found"));

        const staffExists = await User.findById(staff)
        if(!staffExists) return next(errorHandler(404,"Staff not found"))
        const newBatch = new Batch({
            batchName,
            course,
            students,
            staff,
            schedule,
            startDate,
            endDate
            
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
        const batches = await Batch.find().populate("course students staff");
        res.status(200).json({
            success: true,
            msg: batches
        })
    
    }catch(err){
        next(err)
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


async function getBatchWithStaff (req, res, next) {
    try {
        const batchWithStaff = await Batch.aggregate([
            {
                $lookup: {
                    from :"staffs",
                    // localField: 
                }
            }
        ])
    } catch(err) {
        next(err) ;
    }
}
module.exports = {
    createBatch,
    getAllBatch,
    getBatchById,
    updateBatch,
    deleteBatch,
    getTotalBatches
}