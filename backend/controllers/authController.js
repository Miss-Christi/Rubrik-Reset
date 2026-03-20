import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    // Require specific email domain (e.g. gmail.com) for official accounts
    const officialDomain = process.env.OFFICIAL_EMAIL_DOMAIN || "gmail.com";
    if (!email.toLowerCase().endsWith(`@${officialDomain}`)) {
        res.status(400);
        throw new Error(`Only official @${officialDomain} emails are allowed to sign up.`);
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Require specific email domain (e.g. gmail.com) for official accounts
    const officialDomain = process.env.OFFICIAL_EMAIL_DOMAIN || "gmail.com";
    if (!email.toLowerCase().endsWith(`@${officialDomain}`)) {
        res.status(401);
        throw new Error(`Only official @${officialDomain} emails are allowed to log in.`);
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Auto-promote if this is the designated admin email
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase() && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// --- NEW FUNCTIONS BELOW ---

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        // If you want to allow email updates, uncomment below:
        // user.email = req.body.email || user.email;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user password
// @route   PUT /api/profile/password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } else {
        res.status(401);
        throw new Error("Invalid current password");
    }
});

// @desc    Forgot Password (generate token & send email)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("There is no user with that email");
    }

    if (user.googleId) {
        res.status(400);
        throw new Error("This account was created with Google. Please use 'Sign in with Google'.");
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // HTML Message
    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'Rubrik Reset <onboarding@resend.dev>',
            to: user.email,
            subject: 'Password Reset Request',
            html: message
        });

        res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500);
        throw new Error("Email could not be sent");
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Invalid or expired token");
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        token: generateToken(user._id)
    });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = role;
        await user.save();
        res.json({ message: `User role updated to ${role}` });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Option: Check if it's the last admin
        if (user.role === 'admin') {
           const adminCount = await User.countDocuments({ role: 'admin' });
           if (adminCount <= 1) {
                res.status(400);
                throw new Error("Cannot delete the last admin user");
           }
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User deleted successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    updateUserProfile,
    updateUserPassword,
    forgotPassword,
    resetPassword,
    updateUserRole,
    deleteUser
};