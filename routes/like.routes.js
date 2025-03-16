const express = require("express");
const { likePost, unlikePost } = require("../controllers/like.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Like a post
router.post("/", authMiddleware, likePost);

// Unlike a post
router.delete("/", authMiddleware, unlikePost);

module.exports = router;
