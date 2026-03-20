import express from "express";
import asyncHandler from "express-async-handler";
import Purchase from "../models/Purchase.js";
import UserChallenge from "../models/UserChallenge.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Process Checkout and create Purchase/UserChallenge records
// @route   POST /api/orders/checkout
// @access  Private
router.post(
    "/checkout",
    protect,
    asyncHandler(async (req, res) => {
        const { cart, formData } = req.body;

        if (!cart || cart.length === 0) {
            res.status(400);
            throw new Error("Cart is empty");
        }

        const purchases = [];

        for (const item of cart) {
            // Determine itemType and ID (handling both _id from DB and id from static)
            const itemId = item._id || item.id;
            const itemType = (item.category === 'Challenge' || item.days) ? 'Challenge' : 'Product';

            // Create Purchase record
            const purchase = await Purchase.create({
                userId: req.user._id,
                itemId: itemId,
                itemType: itemType,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
                purchaseDate: new Date()
            });

            // If it's a Challenge, also create a UserChallenge record for progress tracking
            if (itemType === 'Challenge') {
                const existingJoin = await UserChallenge.findOne({
                    user: req.user._id,
                    challenge: itemId
                });

                if (!existingJoin) {
                    await UserChallenge.create({
                        user: req.user._id,
                        challenge: itemId,
                        status: "active",
                        totalPoints: 0,
                        completedDays: 0
                    });
                }
            }

            purchases.push(purchase);
        }

        res.status(201).json({
            message: "Order placed successfully",
            purchases
        });
    })
);

export default router;
