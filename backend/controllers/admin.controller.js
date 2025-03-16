
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
 const User = require("../db/models/user.model") ;
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function adminDashboard(req, res, next) {
    res.status(200).json({
        message: "Welcome to Student"
    })
}


async function createAdmin(req, res, next) {
    const {name, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const admin = new User({
        name, email, password: hashedPassword,role:"Admin"
    })
    await admin.save();
    res.status(201).json({
        message: "Admin created successfully"
    })
}
module.exports = {
    createAdmin,
    adminDashboard
}