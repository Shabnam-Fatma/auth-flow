const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mern_auth");
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed!", error);
        process.exit(1);
    }
};

module.exports = connectDB;