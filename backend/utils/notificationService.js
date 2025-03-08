const User = require("../db/models/user.model");
const Notification = require("../db/models/notification.model");
const nodemailer = require("nodemailer");
const errorHandler = require("./errorHandler");


async function sendNotification(studentId, message) {
    try {
        const student = await User.findById(studentId);
        if(!student) {
             console.log("Student not found")
              return;
        }
        const parent = await User.findOne({email: student.parentEmail})
        const notification = new Notification({
            userId : studentId,
            message: message,
            sendAt: new Date()
        })
        await notification.save();
        if(student.email)
                await sendEmail(student.email, "Attendance Notification", message);
        if(parent && parent.email) 
                await sendEmail(parent.email, "Attendance Notification", `Your child ${student.name} was marked absent`)
    console.log("Notification sent successfully")
    }catch(err) {
        console.log(err)
    }

}


async function sendEmail (to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    })



    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: text
    }
    await transporter.sendMail(mailOptions)
}



module.exports ={sendNotification}