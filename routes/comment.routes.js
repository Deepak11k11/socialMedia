const express = require("express");
const { createComment, getComments } = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Create a comment
router.post("/", authMiddleware, createComment);

// Get comments for a post
router.get("/:postId", authMiddleware, getComments);

module.exports = router;
