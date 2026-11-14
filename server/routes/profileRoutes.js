const express = require("express");

const router = express.Router();

const { getProfile } = require("../controllers/profileController");

const verifyToken = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, getProfile);

module.exports = router;