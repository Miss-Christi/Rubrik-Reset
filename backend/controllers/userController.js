import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import UserChallenge from "../models/UserChallenge.js";

// @desc    Get user downloads (Digital Assets excluding Challenges)
// @route   GET /api/user/downloads
// @access  Private
const getUserDownloads = asyncHandler(async (req, res) => {
    // Find all purchases for this user and correctly populate the product details
    const purchases = await Purchase.find({ userId: req.user._id })
        .populate("productId")
        .sort({ purchaseDate: -1 });

    // Filter to only products that exist and are NOT challenges
    const downloads = purchases.filter(p => p.productId && p.productId.category !== "Challenge");
    res.json(downloads);
});

// @desc    Get user active challenges (Formation Challenges)
// @route   GET /api/user/challenges
// @access  Private
const getUserChallenges = asyncHandler(async (req, res) => {
    // Fetch from UserChallenge instead of Purchase
    const userChallenges = await UserChallenge.find({ user: req.user._id })
        .populate("challenge");

    const challenges = userChallenges
        .filter(uc => uc.challenge)
        .map(uc => {
            // Extract number from "30 Days" string or fallback
            let totalDays = 30;
            if (uc.challenge.duration) {
                const match = uc.challenge.duration.match(/\d+/);
                if (match) totalDays = parseInt(match[0], 10);
            }

            return {
                id: uc.challenge._id,
                title: uc.challenge.title,
                currentDay: uc.completedDays + 1,
                totalDays: totalDays
            };
        });

    res.json(challenges);
});

// @desc    Get user order history
// @route   GET /api/user/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({ userId: req.user._id })
        .populate("productId")
        .sort({ purchaseDate: -1 });

    const orders = purchases.map(p => ({
        _id: p._id,
        productId: p.productId ? p.productId._id : null,
        productName: p.productId ? p.productId.title : "Unknown Product",
        price: p.productId ? p.productId.price : 0,
        quantity: 1, // Currently fixed at 1 per purchase based on Schema
        purchaseDate: p.purchaseDate
    }));

    res.json(orders);
});

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
const getUserWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.json(user.wishlist || []);
});

// @desc    Toggle product in wishlist
// @route   POST /api/user/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
        user.wishlist.splice(index, 1); // Remove if exists
    } else {
        user.wishlist.push(productId); // Add if doesn't exist
    }

    await user.save();

    // Return the updated populated list
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
});

export {
    getUserDownloads,
    getUserChallenges,
    getUserOrders,
    getUserWishlist,
    toggleWishlist
};
