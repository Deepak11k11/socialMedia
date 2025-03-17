const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: String, required: true },

        category: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store reference to user
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
