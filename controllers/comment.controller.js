const Comment = require("../models/comment.model");

// @desc Create a new comment
// @route POST /api/comments
// @access Private
const createComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        if (!postId || !text) {
            return res.status(400).json({ message: "Post ID and text are required" });
        }

        const comment = new Comment({
            post: postId,
            user: req.user.id,
            text,
        });

        await comment.save();
        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get all comments for a specific post
// @route GET /api/comments/:postId
// @access Private
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate("user", "name username");
        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { createComment, getComments };
