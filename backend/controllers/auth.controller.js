
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
const User = require("../db/models/user.model") ;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Blacklist = require("../db/models/blackList.model");

const generateToken = (id, role) =>{
    return jwt.sign({id,role},process.env.SECRET_KEY, {expiresIn:"1d"})
};

async function login( req, res, next){
    try{
        console.log('hello')
        const {email, password } = req.body;
        console.log(email,password)
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found"))
        const  isValidPassword = bcrypt.compareSync(password, validUser.password);
    
        if(!isValidPassword) return next(errorHandler(401,"Unauthorized"));

        const accessToken = generateToken(validUser._id, validUser.role);
        
        // const accessToken = jwt.sign({id:validUser._id,role:validUser.role},process.env.SECRET_KEY,{expiresIn:"1d"})
        
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
        const token = req.header("Authorization")?.replace("Bearer"," ")
        if(!token) return next(errorHandler(400,"No token is provided"))
        res.status(200).json({
            success: true,
            message: "user has been logged out",
        })

    }catch(err) {
        next(err);
        
    }
}

async function verifyOTP (req, res, next) {
    try {
        const {email, otp, newPassword} = req.body;
        const user = await User.findOne({email});

        if(!user || user.otp !== otp || user.otpExpires < Date.now()){
            return next(errorHandler(400,"Invalid or expired OTP"))
        }


        user.password = await bcrypt.hash(newPassword, 10);
        user.otp  = null;
        user.otpExpires = null;
        await user.save();
        res.status(200).json({
            message: "Password set successfully"
        })
    }catch(err) {
        next(err);
    }
}
const generateOTP = () => Math.floor(1000 + Math.random()*900000).toString();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


async function forgotPassword(req, res, next) {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if( !user ) return next(errorHandler( 400, "User not found" ));

        const otp = generateOTP();
        const otpExpires = Date.now()+ 10 * 60 * 1000;

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save()
        console.log(user)
        const  mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes`
        };

        transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "OTP send to email for password reset"
        })

    }catch(err) {
        next(err);
    }
}


async function  resetPassword (req, res, next ) {
    try {
        const {email, otp, newPassword } = req.body;

        const user = await User.findOne({email});
        if( !user ) return next(errorHandler(400, "User not found"))

        if(user.otp !== otp || user.otpExpires < Date.now()) {
            return next(errorHandler(400, "Invalid or expired OTP"))
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.otp=null;
        user.otpExpires= null;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully. You can now log in "
        })
        
    } catch(err) {
        next(err);
    }
}

module.exports = {
    login,
    logOut,
    verifyOTP,
    forgotPassword,
    resetPassword
}