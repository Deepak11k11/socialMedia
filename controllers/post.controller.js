const Post = require("../models/post.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc Create a new post
// @route POST /api/posts
// @access Private
const createPost = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "social_media_posts",
        });

        // Delete the local file after upload
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            } else {
                console.log("Local file deleted successfully");
            }
        });

        // Save post to database
        const post = new Post({
            user: req.user.id,
            caption: req.body.caption,
            mediaUrl: result.secure_url,
            mediaType: result.resource_type === "image" ? "image" : "video",
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { createPost };
