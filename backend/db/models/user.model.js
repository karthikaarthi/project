
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:   {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
userSchema.pre("save",async function(next) {
    if(this.isModified("password")) return next();
    this.password =  bcrypt.hashSync(this.password, 10)
})
const User = mongoose.model("User",userSchema);
module.exports = User;