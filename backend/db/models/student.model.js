const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
   regNo: {
    type: String,
    required: true,
    unique: true
   },
   name: {
    type: String, 
    required: true
   },
   dateOfBirth: {
    type: String,
    required: true,

   },
   mobileNo: {
    type: String,
    required: true,
    unique: true
   },
   gender: {
    type: String,
    enum:["Male","Female","other"],
    required: true
   },
   occupation: {
    type: String,
   },
   email: {
    type: String,
    unique: true,
    required: true
   },
   subjects: [{
    subjectName: { type: String, required: true},
    status: {
        type: String,
        enum: ['Not Started','In Progress','Completed'],
        default: 'Not Started',
    },
    progress: {
        type: Number,
        default: 0,
    },
    startDate: {type: Date },
    endDate: { type: Date }
   }],
   status: {
    type: String,
    enum: ["active", "onBreak", "completed"],
    default: "active"
   },
   breakDetails: {
    from: { type: Date },
    to: { type: Date },
    reason: { type: String }
   },
   rejoinDate : { type: Date },
   missedModules: [String],
   guardian: {
    fatherName: {
        type: String,
        required: true
    },
    fatherMobile: {
        type: String,
        required: true
    },
    motherMobile: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    }
},
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        pinCode: {type: String, required: true},

    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: true
    },
    education: {
        stdDegreeDiploma: {type: String, required: true},
        major: {type: String, required: true},
        institutionName: {type: String, required: true},
        yearOfStudy: {type: Number, required: true},
        dateOfApplication: {type: Date, default: Date.now}
    }
   
})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;