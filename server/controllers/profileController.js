const User = require("../models/User")

const getProfile = async (req, res) => {
    
    try {
        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error while fetching profile"
        })
    }
}

module.exports = {getProfile}