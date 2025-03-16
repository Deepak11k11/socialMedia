const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        caption: { type: String },
        mediaUrl: { type: String, required: true },
        mediaType: { type: String, enum: ["image", "video"], required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked the post
        comments: [commentSchema] // Array of comments
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
