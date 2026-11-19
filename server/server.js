require("dotenv").config()

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")

const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173"
}))

app.use("/api", authRoutes)
app.use("/api", profileRoutes)

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is live on port ${PORT}`);
    });
});