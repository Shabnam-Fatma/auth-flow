const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User")
const bcrypt = require("bcryptjs")

const app = express();
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/mern_auth")
.then(()=> {
    console.log("MongoDB connected successfully!")
})
.catch((err) => {
    console.log("MongoDB connection failed!", err)
})

const PORT = 3000;

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
                message: err.message
            })
        }

        res.status(500).json({
            message: "Server error"
        })
   }
})

app.post("/api/login", async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    console.log("Found user email:", user?.email);
    console.log("Found user password:", user?.password);
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    console.log(isPasswordValid)
    res.json({
        message: "Login successful"
    })
})

app.listen(PORT, () => {
    console.log(`Server is live... on ${PORT}`);
});