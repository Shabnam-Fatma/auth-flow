require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express();
app.use(express.json())

const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/mern_auth")
.then(()=> {
    app.listen(PORT, () => {
        console.log(`MongoDB connected successfully!, Server is live... on ${PORT}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection failed!", err)
})

function verifyToken (req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied, No token provided"
        })
    }
}

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

app.post("/api/register", async(req, res) => {
   try {
        const {name, email, password} = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            })
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be of atleast 6 characters long"
            })
        }
        
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            ...req.body,
            password:hashedPass
        })
    
        res.status(201).json({
            message: "User registered successfully"
        })
   } catch(err) {
        console.log(err)
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            })
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err
            })
        }

        res.status(500).json({
            message: "Server error"
        })
   }
})

app.post("/api/login", async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill all the fields"})
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "10m"}
        )
        return res.status(200).json({
            message: "Login successful",
            token: token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error",
            error: err
        })
    }
})