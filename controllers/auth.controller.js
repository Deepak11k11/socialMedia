const User = require("../models/users.model");
const Post = require("../models/post.model"); // Import the Post model to retrieve user's posts
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, username, mobile, seller } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword, username, mobile, seller });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Login user and get token
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({ response: "200", data: { token, user: { name: user.name, username: user.username } } });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get current user's profile and their posts
// @route GET /api/auth/profile
// @access Private
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the token

        // Retrieve the user's profile, excluding the password field
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find all posts created by the user, sorted by most recent
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

        // Return user profile along with the user's posts
        res.status(200).json({ success: true, user, posts });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc Search for users by username, name, email or user ID
// @route GET /api/auth/search?q=searchTerm
// @access Private
const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Query parameter 'q' is required." });
        }

        // Create search criteria for username, name, or email (case-insensitive)
        let searchCriteria = {
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        };

        // If the query is a valid ObjectId, add search by _id
        if (mongoose.Types.ObjectId.isValid(query)) {
            searchCriteria.$or.push({ _id: query });
        }

        const users = await User.find(searchCriteria).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, searchUsers };
