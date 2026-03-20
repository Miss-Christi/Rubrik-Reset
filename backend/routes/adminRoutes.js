import express from "express";
const router = express.Router();
import Product from "../models/Product.js";
import Challenge from "../models/Challenge.js";
import Purchase from "../models/Purchase.js";
import SiteContent from "../models/SiteContent.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// @desc    Get Admin Stats (Total Sales, Orders, Users)
// @route   GET /api/admin/stats
router.get("/stats", protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Purchase.countDocuments();

        // Calculate Processed Orders from Challenges
        const challengeData = await Purchase.aggregate([
            { $match: { itemType: 'Challenge' } },
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

// @desc    Get all challenge definitions (for management)
// @route   GET /api/admin/challenges/list
router.get("/challenges/list", protect, admin, async (req, res) => {
    try {
        const challenges = await Challenge.find({});
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Error fetching challenges" });
    }
});

// @desc    Get all users

// @desc    Get challenge participation history
// @route   GET /api/admin/challenges
router.get("/challenges", protect, admin, async (req, res) => {
    try {
        const challengePurchases = await Purchase.find({ itemType: 'Challenge' }).populate("itemId");
        
        const activeChallengesMap = {};

        challengePurchases.forEach(p => {
            if (p.itemId) {
                const id = p.itemId._id.toString();
                if (!activeChallengesMap[id]) {
                    activeChallengesMap[id] = {
                        _id: id,
                        challengeTitle: p.itemId.title,
                        activeUsersCount: 0,
                        status: "active"
                    };
                }
                activeChallengesMap[id].activeUsersCount += 1;
            }
        });

        const challenges = Object.values(activeChallengesMap);
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

// @desc    Add a new challenge
// @route   POST /api/admin/challenges
router.post("/challenges", protect, admin, async (req, res) => {
    try {
        const { title, category, price, image, days, fileUrl } = req.body;
        const challenge = await Challenge.create({
            title,
            category: category || "Challenge",
            price: Number(price) || 0,
            image: image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
            days: Number(days) || 30,
            fileUrl: fileUrl || ""
        });
        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ message: "Error adding challenge" });
    }
});

// @desc    Delete a challenge
// @route   DELETE /api/admin/challenges/:id
router.delete("/challenges/:id", protect, admin, async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (challenge) {
            await challenge.deleteOne();
            res.json({ message: "Challenge removed" });
        } else {
            res.status(404).json({ message: "Challenge not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting challenge" });
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

// @desc    Get editable site content
// @route   GET /api/admin/site-content/:key
router.get("/site-content/:key", async (req, res) => {
    try {
        const content = await SiteContent.findOne({ key: req.params.key });
        res.json({ value: content ? content.value : null });
    } catch (err) {
        res.status(500).json({ message: "Error fetching content" });
    }
});

// @desc    Update editable site content
// @route   PUT /api/admin/site-content/:key
router.put("/site-content/:key", protect, admin, async (req, res) => {
    const { value } = req.body;
    if (!value) return res.status(400).json({ message: "Value is required" });
    const content = await SiteContent.findOneAndUpdate(
        { key: req.params.key },
        { value },
        { upsert: true, new: true }
    );
    res.json(content);
});

export default router;