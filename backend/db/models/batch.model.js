const mongoose = require("mongoose");

const batchSchema = new  mongoose.Schema({
    batchName: {
        type: String,
        required: true
    },
    course: {
  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    }],
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
        
    },
    schedule: {
        days: [String],
        time: String
    },
    startDate: {
        type: Date,
        required: true
    },
    maxStudents: {
        type: Number,
        default: 30
    },
    endDate: {
        type: Date
    },
    notificationEnabled: {
        type: Boolean,
        default: true
    },
    progress: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed", "cancelled"],
        // default: "upcoming"
    }
    
},{ timestamps: true })

const Batch = mongoose.model("Batch",batchSchema);
module.exports = Batch;

