import express from "express";
const router = express.Router();
import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// @desc    Get Admin Stats (Total Sales, Orders, Users)
// @route   GET /api/admin/stats
router.get("/stats", protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Purchase.countDocuments();

        // Summing up revenue using MongoDB Aggregation
        const salesData = await Purchase.aggregate([
            {
                $lookup: {
                    from: "products", // Ensure this matches your collection name in MongoDB
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            { $group: { _id: null, totalSales: { $sum: "$productDetails.price" } } }
        ]);

        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        res.json({
            totalUsers,
            totalOrders,
            totalSales
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats" });
    }
});

// @desc    Add a new product
// @route   POST /api/admin/products
router.post("/products", protect, admin, async (req, res) => {
    try {
        const { title, category, price, fileUrl } = req.body;

        const product = await Product.create({
            title,
            category,
            price,
            fileUrl,
            fileName: title.replace(/\s+/g, '_') + ".pdf" // Standardizing file name
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
    }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
router.delete("/products/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

export default router;