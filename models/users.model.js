const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    bioData: { type: String, required: true },
    seller: { type: Boolean, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
