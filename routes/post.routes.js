const express = require("express");
const multer = require("multer");
const { createPost, getPosts } = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Configure multer to store files in the uploads folder
const upload = multer({ dest: "uploads/" });

// Endpoint to create a new post (upload file, then delete local copy)
router.post("/", authMiddleware, upload.single("file"), createPost);

// Endpoint to get posts from the users that the authenticated user follows
router.post("/getPosts", authMiddleware, getPosts);

module.exports = router;
