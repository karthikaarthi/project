const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
