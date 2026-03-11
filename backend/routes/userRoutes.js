import express from "express";
import {
    getUserDownloads,
    getUserChallenges,
    getUserOrders,
    getUserWishlist,
    toggleWishlist
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/downloads", protect, getUserDownloads);
router.get("/challenges", protect, getUserChallenges);
router.get("/orders", protect, getUserOrders);
router.get("/wishlist", protect, getUserWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);

export default router;
