import express from "express";
import SiteContent from "../models/SiteContent.js";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get site content (Terms & Privacy)
// @route   GET /api/content
// @access  Public
router.get("/", asyncHandler(async (req, res) => {
  let content = await SiteContent.findOne({ type: "legal" });

  // Seed default content if it doesn't exist yet
  if (!content) {
    content = await SiteContent.create({ type: "legal" });
  }

  res.json(content);
}));

// @desc    Update site content (Terms & Privacy)
// @route   PUT /api/content
// @access  Private/Admin
router.put("/", protect, admin, asyncHandler(async (req, res) => {
  const { privacyPolicy, termsOfService } = req.body;

  let content = await SiteContent.findOne({ type: "legal" });

  if (!content) {
    content = new SiteContent({ type: "legal" });
  }

  if (privacyPolicy) content.privacyPolicy = privacyPolicy;
  if (termsOfService) content.termsOfService = termsOfService;

  const updatedContent = await content.save();
  res.json(updatedContent);
}));

export default router;
