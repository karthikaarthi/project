
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    role: {
        type: String,
        enum: [ 'Student', 'Staff', 'Admin'],
        required: true
    },
    parentEmail: {
        type: String,
        required: function() {
            return this.role === "Student"
        }
    },
    phone: {
        type: String,
        // required: function() {
        //     return this.role === "Student";
        // },
        // unique: function() {
        //     return this.role === "Student";
        // }
    }
},{ timestamps: true})
const User = mongoose.model("User",userSchema);
module.exports = User;