const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // },
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
    applyingFor: {
        type: String,
        required: true
    },
    education: {
        stdDegreeDiploma: {type: String, required: true},
        major: {type: String, required: true},
        institutionName: {type: String, required: true},
        yearOfStudy: {type: Number, required: true},
        dateOfApplication: {type: Date, default: Date.now}
    },
    officeUse: {
        courseName: {type: String, required: true},
        duration:{type: String, required: true},
        startDate: {type: Date, required: true},
        batchTime: {type: String, required: true},
        totalAmout: {type: Number, required: true},
        paymentMethod: {
            type: String, 
            enum: ["Installment","Lump Sum"],
            required: true
        },
    }
   
})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;