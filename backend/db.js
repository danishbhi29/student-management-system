const mongoose = require("mongoose");




//function to connect with database
const url = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log("Unable to connect with MongoDB");
    }
};




module.exports = connectDB;