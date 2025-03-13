const express = require("express");
const multer = require("multer");
const { createPost } = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("file"), createPost);

module.exports = router;
