import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import nodemailer from "nodemailer";

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
        // Send email notification using Nodemailer
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER || "therubrikreset@gmail.com",
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER || "therubrikreset@gmail.com",
                to: "therubrikreset@gmail.com",
                subject: `New Contact Form Submission from ${name}`,
                text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nNewsletter Signup: ${newsletter ? "Yes" : "No"}\n\nMessage:\n${message}`,
                html: `<p>You have received a new message from the contact form.</p>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Newsletter Signup:</strong> ${newsletter ? "Yes" : "No"}</p>
                       <p><strong>Message:</strong></p>
                       <p>${message}</p>`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Contact form email sent successfully.");
        } catch (error) {
            console.error("Error sending contact form email:", error);
            // We don't throw an error here to prevent the request from failing just because the email failed.
        }

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
