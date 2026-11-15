require("dotenv").config()

const express = require("express");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")

const app = express();

app.use(express.json())

app.use("/api", authRoutes)
app.use("/api", profileRoutes)

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is live on port ${PORT}`);
    });
});