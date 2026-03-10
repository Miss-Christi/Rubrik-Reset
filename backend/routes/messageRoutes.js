import express from "express";
import { createMessage, getMessages } from "../controllers/messageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(createMessage).get(protect, admin, getMessages);

export default router;
