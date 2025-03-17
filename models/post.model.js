const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
