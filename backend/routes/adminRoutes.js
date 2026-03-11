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

        // Calculate Processed Orders from Challenges
        // We aggregate Purchases, lookup the Product, and count where category is 'Challenge'
        const challengeData = await Purchase.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            { $match: { "productDetails.category": "Challenge" } },
            { $count: "challengeOrders" }
        ]);

        const totalChallengeOrders = challengeData.length > 0 ? challengeData[0].challengeOrders : 0;

        res.json({
            totalUsers,
            totalOrders,
            totalChallengeOrders
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats" });
    }
});

// @desc    Add a new product
// @route   POST /api/admin/products
router.post("/products", protect, admin, async (req, res) => {
    try {
        const { title, category, price, fileUrl, days } = req.body;

        const product = await Product.create({
            title,
            category,
            price,
            fileUrl,
            days, // Added for challenges
            fileName: title.replace(/\s+/g, '_') + (category === 'Challenge' ? '' : ".pdf") // Don't append .pdf for challenges if not needed, but keep it standard for now. Or leave as is.
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