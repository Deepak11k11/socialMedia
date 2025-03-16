const express = require("express");
const { registerUser, loginUser, getProfile, searchUsers } = require("../controllers/auth.controller");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const validateRegistration = [
    check("username", "UserName is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

const validateLogin = [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
];

router.post("/register", validateRegistration, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, registerUser);

router.post("/login", validateLogin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, loginUser);

router.get('/profile', authMiddleware, getProfile);

// New endpoint: Search for users by query
// Example: GET /api/auth/search?q=john
router.get('/search', authMiddleware, searchUsers);

module.exports = router;
