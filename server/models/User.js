const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
},
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be atleast 6 characters long'],
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User