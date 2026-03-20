import express from "express";
import asyncHandler from "express-async-handler";
import Reflection from "../models/Reflection.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all reflections
// @route   GET /api/reflections
router.get("/", asyncHandler(async (req, res) => {
    const reflections = await Reflection.find({}).sort({ createdAt: -1 });
    res.json(reflections);
}));

// @desc    Create a reflection
// @route   POST /api/reflections
router.post("/", protect, admin, asyncHandler(async (req, res) => {
    const { title, content, image, author, category, readTime } = req.body;
    const reflection = await Reflection.create({
        title, content, image, author, category, readTime
    });
    res.status(201).json(reflection);
}));

// @desc    Delete a reflection
// @route   DELETE /api/reflections/:id
router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
    const reflection = await Reflection.findById(req.params.id);
    if (reflection) {
        await reflection.deleteOne();
        res.json({ message: "Reflection removed" });
    } else {
        res.status(404);
        throw new Error("Reflection not found");
    }
}));

export default router;
