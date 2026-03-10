import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
    const { name, email, message, newsletter } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error("Please provide name, email, and message");
    }

    const newMessage = await Message.create({
        name,
        email,
        message,
        newsletter: newsletter || false,
    });

    if (newMessage) {
        res.status(201).json({
            _id: newMessage._id,
            name: newMessage.name,
            email: newMessage.email,
            message: newMessage.message,
            newsletter: newMessage.newsletter,
        });
    } else {
        res.status(400);
        throw new Error("Invalid message data");
    }
});

// @desc    Get all messages (for admin)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

export { createMessage, getMessages };
