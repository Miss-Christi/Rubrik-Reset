import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// @desc    Fetch all public products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                  title: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};
            
        const category = req.query.category ? { category: req.query.category } : {};

        const products = await Product.find({ ...keyword, ...category }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;
