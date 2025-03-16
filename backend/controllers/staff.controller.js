const { model } = require("mongoose");
const User = require("../db/models/user.model");
const errorHandler = require("../utils/errorHandler");

async function createStaff ( req, res, next){
    try {
        const {name, email, password, phone, department, salary} = req.body;

        const existingStaff = await User.findOne({email});
        if(existingStaff) return next(errorHandler(400, "Staff already exists"));

        const newStaff = new User({
            name, 
            email,
            password,
            phone,
            role: "Staff",
            department,
            salary
        });
        await newStaff.save();
        res.status(201).json({
            success: true,
            data: newStaff
        })
    }catch(err){
        next(err);

    }
}

async function getAllStaff( req, res, next ) {
    try {
        const staff = await User.find({role: "Staff"});
        res.status(200).json({
            success: true,
            data: staff
        })
    }catch(err) {
        next(err);
    }
}

async function getStaffId(req, res, next) {
    try {
        const staff = await User.findById(req.params.id);
        if(!staff || staff.role!== "Staff") return next(errorHandler(404,"Staff not found"));
        res.status(200).json({
            success: true,
            data: staff
        })
    }catch(err) {
        next(err);
    }
}

async function updateStaff ( req, res, next) {
    try {
        const updatedStaff = await User.findByIdAndUpdate(req.params.id, req.body,{new: true});
        if(!updatedStaff || updatedStaff.role !== "Staff"){
            return next(errorHandler(404, "Staff not found"))
        }

        res.status(200).json({
            success: true,
            data: updatedStaff
        })
    }catch(err) {
        next(err);
    }
}


async function deleteStaff ( req, res, next ) {
    try {
        const deletedStaff = await User.findByIdAndDelete(req.params.id);
        if(!deletedStaff || deletedStaff.role !== "Staff"){
            return next(errorHandler(404, "Staff not found"));
        }

        res.status(200).json({
            success: true,
            message: "Staff mumber deleted successfully"
        })
    }catch(err) {
        next(err);
    }
}


async function staffDashboard(req, res, next) {
    res.status(200).json({
        message: "Welcome to Staff"
    })
}

module.exports = {
    createStaff,
    getAllStaff,
    getStaffId,
    updateStaff,
    deleteStaff,
    staffDashboard
}