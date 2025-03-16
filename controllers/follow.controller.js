const User = require("../models/users.model");

// @desc Follow a user
// @route POST /api/follow
// @access Private
const followUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) {
            return res.status(400).json({ message: "Target user ID is required" });
        }

        // Prevent self-following
        if (targetUserId === req.user.id) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        // Find current user and the target user
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already following
        if (currentUser.following && currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        // Add target user to current user's following and add current user to target's followers
        currentUser.following.push(targetUserId);
        targetUser.followers.push(req.user.id);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { followUser };
