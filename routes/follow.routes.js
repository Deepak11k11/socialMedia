const express = require("express");
const { followUser } = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, followUser);

module.exports = router;
