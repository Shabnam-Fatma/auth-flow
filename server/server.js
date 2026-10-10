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
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({...req.body, password:hashedPass})
    res.json(user)
})

app.listen(PORT, () => {
    console.log(`Server is live... on ${PORT}`);
});