// const Post = require("../models/post.model");
// const cloudinary = require("../config/cloudinary");
// const fs = require("fs");


// const createPost = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//         // Upload file to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             resource_type: "auto",
//             folder: "social_media_posts",
//         });

//         // Delete the local file after upload
//         fs.unlink(req.file.path, (err) => {
//             if (err) {
//                 console.error("Error deleting local file:", err);
//             } else {
//                 console.log("Local file deleted successfully");
//             }
//         });

//         // Save post to database
//         const post = new Post({
//             user: req.user.id,
//             caption: req.body.caption,
//             mediaUrl: result.secure_url,
//             mediaType: result.resource_type === "image" ? "image" : "video",
//         });

//         await post.save();
//         res.status(201).json({ message: "Post created successfully", post });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error });
//     }
// };

// module.exports = { createPost };



















const Post = require("../models/post.model");
const User = require("../models/users.model"); // Import User model to access following list
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const createPost = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });

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

const getPosts = async (req, res) => {
    try {
        // Find the current user to retrieve the following list
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        // Query posts from users that the current user follows
        const posts = await Post.find({ user: { $in: currentUser.following } })
            .sort({ createdAt: -1 })
            .populate("user", "name username");

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createPost, getPosts };
