import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    getUsers,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/me", protect, getMe);
router.get("/admin/users", protect, admin, getUsers);

export default router;
