const express = require("express");
const router = express.Router();

const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getUserProducts } = require("../controllers/product.controller");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/products", authMiddleware, upload.single("image"), createProduct);
router.get("/products", authMiddleware, getProducts);
router.get("/products/:id", authMiddleware, getProductById);
router.put("/products/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);
router.get("/adminProducts", authMiddleware, getUserProducts);
module.exports = router;
