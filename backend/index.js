const express = require("express");
const app = express();
const authRouter = require("./routes/auth.router");
const mongodb = require("./db")
const studentRouter = require("./routes/student.router");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const courseRouter = require("./routes/course.router")
const batchRouter =require("./routes/batch.router")
const attendanceRouter = require("./routes/attendance.router");
const staffRouter = require("./routes/staff.router")
const { default: mongoose } = require("mongoose");
const User = require("./db/models/user.model");
const bcrypt =require("bcryptjs");
require("dotenv").config();

mongodb.connect();
app.use(cors())
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true
//   }));
  
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/staff", staffRouter)
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/batch", batchRouter);
app.use("/api/v1/attendance", attendanceRouter);

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    })
})


async function createAdmin (){
    const hashedPassword = bcrypt.hashSync("admin@123",10);
    const admin = new User({
        name: "Kavitha",
        email: "kavitha@gmail.com",
        password: hashedPassword,
        role: "Admin"
    })
    await admin.save();
    console.log("Admin created successfully!")
    mongoose.disconnect(); 
}

// createAdmin();
app.listen(3000,'0.0.0.0',()=>console.log("Server is running on 3000 port"));