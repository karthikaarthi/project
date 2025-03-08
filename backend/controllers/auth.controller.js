
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
 const User = require("../db/models/user.model") ;
const jwt = require("jsonwebtoken");
require("dotenv").config();


async function registerStudent(req, res, next) {
    try{
        const {name, email, password, parentEmail, phone} = req.body;

        // if(role == 'Admin') return next(errorHandler(403,"Cannor self-register as Admin"))
        const existingStudent = await User.findOne({email});
        if(existingStudent) return next(errorHandler(400,"Student already exists"))
        const hashedPassword = bcrypt.hashSync(password,10);
        const newStudent = new User ({name,email,password:hashedPassword,role: "Student", parentEmail,phone})
        await newStudent.save();
        const {password:_, ...rest} = newStudent._doc;
        res.status(201).json({
            message: true,
            data: {
                user: rest
            }
        })
      
    }catch(err) {
        if(err.message.includes("duplicate key"))
                return next(errorHandler(409,"Duplicate key"))
        next(err);
    }
}

async function registerStaff(req, res, next) {
    try{
        const {name, email, password} = req.body;

        const existingStaff = await User.findOne({email});
        if(existingStaff) return next(errorHandler(400,"Staff already exists"))
        const hashedPassword = bcrypt.hashSync(password,10);
        const newStaff = new User ({name,email,password:hashedPassword,role: "Staff"})
        await newStaff.save();
        const {password:_, ...rest} = newStaff._doc;
        res.status(201).json({
            message: true,
            data: {
                user: rest
            }
        })
      
    }catch(err) {
        if(err.message.includes("duplicate key"))
                return next(errorHandler(409,"Duplicate key"))
        next(err);
    }
}

async function login( req, res, next){
    try{
        const {email, password } = req.body;
        console.log(email,password)
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found"))
        const  isValidPassword =await bcrypt.compare(password, validUser.password);
    
        if(!isValidPassword) return next(errorHandler(401,"Unauthorized"));

        const accessToken = jwt.sign({id:validUser._id,role:validUser.role},process.env.SECRET_KEY,{expiresIn:"1d"})
        
                res.status(200)
                .json({
            success: true,
            data: {
                access_token: accessToken,
                role: validUser.role
                
            }
        })
    }catch(err) {
        next(err);
    }

}

async function logOut(req, res, next) {

    try{
        res.status(200).json({
            success: true,
            message: "user has been logged out",
        })

    }catch(err) {
        next(err);
    }
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
    registerStudent,
    login,
    logOut,
    createAdmin,
    registerStaff
}