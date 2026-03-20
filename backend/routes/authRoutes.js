import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    updateUserProfile,    // New Controller Function
    updateUserPassword,   // New Controller Function
    forgotPassword,
    resetPassword,
    updateUserRole,
    deleteUser,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import Purchase from "../models/Purchase.js"; // Needed for the download check

const router = express.Router();

// --- Existing Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.get("/me", protect, getMe);
router.get("/admin/users", protect, admin, getUsers);
router.put("/admin/users/:id/role", protect, admin, updateUserRole);
router.delete("/admin/users/:id", protect, admin, deleteUser);

// --- NEW: Profile Management Routes ---
// Logic: User must be logged in (protect) to update their own info
router.put("/profile/update", protect, updateUserProfile);
router.put("/profile/password", protect, updateUserPassword);

// --- NEW: Download Logic Guard ---
// This endpoint checks if a user CAN download before the UI triggers the link
router.get("/downloads/check/:purchaseId", protect, async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.purchaseId);

        if (!purchase) return res.status(404).json({ message: "Purchase not found" });

        // Check Limit
        if (purchase.downloadCount >= purchase.maxDownloadLimit) {
            return res.status(403).json({ message: "Download limit reached (3 attempts max)." });
        }

        // Check Expiry
        if (new Date() > purchase.expiryDate) {
            return res.status(403).json({ message: "This download link has expired." });
        }

        res.status(200).json({ message: "Check passed" });
    } catch (error) {
        res.status(500).json({ message: "Server error during check" });
    }
});

export default router;