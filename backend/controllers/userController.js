import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import UserChallenge from "../models/UserChallenge.js";

// @desc    Get user downloads (Digital Assets excluding Challenges)
// @route   GET /api/user/downloads
// @access  Private
const getUserDownloads = asyncHandler(async (req, res) => {
    // Find all purchases for this user and correctly populate the item details
    const purchases = await Purchase.find({ userId: req.user._id, itemType: 'Product' })
        .populate("itemId")
        .sort({ purchaseDate: -1 });

    // Filter to only items that exist and are NOT challenges (though filtered by itemType already)
    const downloads = purchases.filter(p => p.itemId);
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
        .populate("itemId")
        .sort({ purchaseDate: -1 });

    const orders = purchases.map(p => ({
        _id: p._id,
        productId: p.itemId ? p.itemId._id : null,
        productName: p.itemId ? p.itemId.title : "Unknown Item",
        price: p.itemId ? p.itemId.price : 0,
        quantity: 1,
        purchaseDate: p.purchaseDate
    }));

    res.json(orders);
});

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
const getUserWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('wishlistedProducts')
        .populate('wishlistedChallenges');
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    const combined = [
        ...(user.wishlistedProducts || []),
        ...(user.wishlistedChallenges || [])
    ];
    res.json(combined);
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

    const isProduct = await Product.exists({ _id: productId });
    
    if (isProduct) {
        const index = user.wishlistedProducts.indexOf(productId);
        if (index > -1) user.wishlistedProducts.splice(index, 1);
        else user.wishlistedProducts.push(productId);
    } else {
        // Check if it's a Challenge
        const challengeExists = await Challenge.exists({ _id: productId });
        if (challengeExists) {
            const index = user.wishlistedChallenges.indexOf(productId);
            if (index > -1) user.wishlistedChallenges.splice(index, 1);
            else user.wishlistedChallenges.push(productId);
        } else {
            // Clean up if not found in either
            user.wishlistedProducts = user.wishlistedProducts.filter(id => id.toString() !== productId);
            user.wishlistedChallenges = user.wishlistedChallenges.filter(id => id.toString() !== productId);
        }
    }

    await user.save();

    // Return the updated populated combined list
    const updatedUser = await User.findById(req.user._id)
        .populate('wishlistedProducts')
        .populate('wishlistedChallenges');
        
    const combined = [
        ...(updatedUser.wishlistedProducts || []),
        ...(updatedUser.wishlistedChallenges || [])
    ];
    res.json(combined);
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            state: user.state,
            city: user.city,
            landmark: user.landmark,
            pincode: user.pincode,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.state = req.body.state || user.state;
        user.city = req.body.city || user.city;
        user.landmark = req.body.landmark || user.landmark;
        user.pincode = req.body.pincode || user.pincode;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            state: updatedUser.state,
            city: updatedUser.city,
            landmark: updatedUser.landmark,
            pincode: updatedUser.pincode,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    getUserDownloads,
    getUserChallenges,
    getUserOrders,
    getUserWishlist,
    toggleWishlist,
    getUserProfile,
    updateUserProfile
};
