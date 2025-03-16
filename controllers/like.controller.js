const Like = require("../models/like.model");

// @desc Like a post
// @route POST /api/likes
// @access Private
const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        if (!postId) return res.status(400).json({ message: "Post ID is required" });

        // Prevent duplicate likes by the same user
        const existingLike = await Like.findOne({ post: postId, user: req.user.id });
        if (existingLike) return res.status(400).json({ message: "You have already liked this post" });

        const like = new Like({
            post: postId,
            user: req.user.id,
        });
        await like.save();
        res.status(201).json({ message: "Post liked successfully", like });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Unlike a post
// @route DELETE /api/likes
// @access Private
const unlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        if (!postId) return res.status(400).json({ message: "Post ID is required" });

        // Find and remove the like for this user and post
        const like = await Like.findOneAndDelete({ post: postId, user: req.user.id });
        if (!like) return res.status(400).json({ message: "Like not found" });

        res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { likePost, unlikePost };
