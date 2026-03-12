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

// @desc    Get all products
// @route   GET /api/admin/products
router.get("/products", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get("/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// @desc    Get challenge participation history
// @route   GET /api/admin/challenges
router.get("/challenges", protect, admin, async (req, res) => {
    try {
        // Find purchases that correspond to challenges
        const challengePurchases = await Purchase.find({}).populate("productId userId");
        const challenges = challengePurchases
            .filter(p => p.productId && p.productId.category === "Challenge")
            .map(p => ({
                userName: p.userId ? p.userId.name : "Unknown User",
                challengeTitle: p.productId.title,
                createdAt: p.purchaseDate,
                status: "active"
            }));
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Error fetching challenge stats" });
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