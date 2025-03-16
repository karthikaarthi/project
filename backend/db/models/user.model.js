
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    // name:   {
    //     type: String,
    //     required: true
    // },
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
    },
    department: {
        type: String,
        required: function(){
            return this.role === "staff";
        }
    },
    salary: {
        type: Number,
        required: function() {
            return this.role === "staff"
        }
    }
    // assignedBatches: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Batch"
    // }]

},{ timestamps: true})
const User = mongoose.model("User",userSchema);
module.exports = User;