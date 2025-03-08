const mongoose = require("mongoose");
require("dotenv").config();
console.log("hello")
async function connect() {
    try{
       await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfuuly");
        console.log("Connected to database: ",mongoose.connection.db.databaseName.toUpperCase())
    
    }catch(err) {
        console.log("Database error: ",err.message);
    }
}

module.exports = {connect};