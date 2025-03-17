const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Create a new product (Admin)
// @route   POST /api/ecommerce/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });

        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "ecommerce_products",
        });

        // Delete local file after upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        // Create new product
        const product = new Product({
            name,
            description,
            price,

            category,
            image: result.secure_url,
            user: req.user.id, // Store user ID from token
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all products (Public)
// @route   GET /api/ecommerce/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get a single product by ID (Public)
// @route   GET /api/ecommerce/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("user", "name email");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all products added by a specific user
// @route   GET /api/ecommerce/my-products
// @access  Private (User only)
const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update product (Admin or Owner)
// @route   PUT /api/ecommerce/products/:id
// @access  Private (Admin or Product Owner)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if the user is an admin or the product owner
        if (product.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const { name, description, price, stock, category } = req.body;
        let updateFields = { name, description, price, stock, category };

        // If new image is uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
                folder: "ecommerce_products",
            });

            // Delete local file after upload
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting local file:", err);
            });

            updateFields.image = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete product (Admin or Owner)
// @route   DELETE /api/ecommerce/products/:id
// @access  Private (Admin or Product Owner)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if the user is an admin or the product owner
        if (product.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { createProduct, getProducts, getProductById, getUserProducts, updateProduct, deleteProduct };
