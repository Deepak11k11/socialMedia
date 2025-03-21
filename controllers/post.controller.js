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
















// // // followers posts

// const Post = require("../models/post.model");
// const User = require("../models/users.model"); // Make sure the path is correct
// const Like = require("../models/like.model");
// const Comment = require("../models/comment.model");
// const cloudinary = require("../config/cloudinary");
// const fs = require("fs");

// // @desc    Create a new post with media upload
// // @route   POST /api/posts
// // @access  Private
// const createPost = async (req, res) => {
//     try {
//         // Validate that a file has been uploaded
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

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

//         // Create new post document with the media URL from Cloudinary
//         const post = new Post({
//             user: req.user.id,
//             caption: req.body.caption,
//             mediaUrl: result.secure_url,
//             mediaType: result.resource_type === "image" ? "image" : "video",
//         });

//         await post.save();
//         res.status(201).json({ message: "Post created successfully", post });
//     } catch (error) {
//         console.error("Error creating post:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// // @desc    Get posts for users the current user follows, with likes count and comments
// // @route   POST /api/posts/all
// // @access  Private
// const getPosts = async (req, res) => {
//     try {
//         // Find the current user to get the following list
//         const currentUser = await User.findById(req.user.id);
//         if (!currentUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Find posts from users that the current user follows
//         const posts = await Post.find({ user: { $in: currentUser.following } })
//             .sort({ createdAt: -1 })
//             .populate("user", "name username");

//         // For each post, get the number of likes and the related comments
//         const postsWithExtras = await Promise.all(
//             posts.map(async (post) => {
//                 // Count likes for this post
//                 const likesCount = await Like.countDocuments({ post: post._id });
//                 // Get all comments for this post, populating the user field
//                 const comments = await Comment.find({ post: post._id })
//                     .populate("user", "name username")
//                     .sort({ createdAt: 1 }); // Chronologically sorted comments

//                 return {
//                     ...post.toObject(),
//                     likesCount,
//                     comments,
//                 };
//             })
//         );

//         res.status(200).json({ posts: postsWithExtras });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// module.exports = { createPost, getPosts };










const Post = require("../models/post.model");
const User = require("../models/users.model");
const Like = require("../models/like.model");
const Comment = require("../models/comment.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Create a new post with media upload
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        // Validate that a file has been uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

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

        // Create new post document with the media URL from Cloudinary
        const post = new Post({
            user: req.user.id,
            caption: req.body.caption,
            mediaUrl: result.secure_url,
            mediaType: result.resource_type === "image" ? "image" : "video",
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all posts from the database with likes count and comments
// @route   POST /api/posts/all
// @access  Private
const getPosts = async (req, res) => {
    try {
        // Find all posts, sorted by most recent, and populate the user details
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name username");

        // For each post, get the number of likes and the related comments
        const postsWithExtras = await Promise.all(
            posts.map(async (post) => {
                // Count likes for this post
                const likesCount = await Like.countDocuments({ post: post._id });
                // Get all comments for this post, populating the user field
                const comments = await Comment.find({ post: post._id })
                    .populate("user", "name username")
                    .sort({ createdAt: 1 }); // Chronologically sorted comments

                return {
                    ...post.toObject(),
                    likesCount,
                    comments,
                };
            })
        );

        res.status(200).json({ posts: postsWithExtras });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createPost, getPosts };
