import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/products/:id
// @access  Private
router.post(
    "/products/:id",
    protect,
    asyncHandler(async (req, res) => {
        const productId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Create arrays if they don't exist yet (for older user records)
        if (!user.wishlistedProducts) user.wishlistedProducts = [];

        const isWishlisted = user.wishlistedProducts.includes(productId);

        if (isWishlisted) {
            user.wishlistedProducts = user.wishlistedProducts.filter(
                (id) => id.toString() !== productId.toString()
            );
        } else {
            user.wishlistedProducts.push(productId);
        }

        await user.save();
        res.json(user.wishlistedProducts);
    })
);

// @desc    Toggle challenge in wishlist
// @route   POST /api/wishlist/challenges/:id
// @access  Private
router.post(
    "/challenges/:id",
    protect,
    asyncHandler(async (req, res) => {
        const challengeId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        if (!user.wishlistedChallenges) user.wishlistedChallenges = [];

        const isWishlisted = user.wishlistedChallenges.includes(challengeId);

        if (isWishlisted) {
            user.wishlistedChallenges = user.wishlistedChallenges.filter(
                (id) => id.toString() !== challengeId.toString()
            );
        } else {
            user.wishlistedChallenges.push(challengeId);
        }

        await user.save();
        res.json(user.wishlistedChallenges);
    })
);

// @desc    Get user's complete wishlist
// @route   GET /api/wishlist
// @access  Private
router.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id)
            .populate("wishlistedProducts")
            .populate("wishlistedChallenges");

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json({
            products: user.wishlistedProducts || [],
            challenges: user.wishlistedChallenges || [],
        });
    })
);

export default router;
