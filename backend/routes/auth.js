import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @desc    Authenticate with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback (The return trip)
// @route   GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful login! Generate token
        const user = req.user;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Redirect to frontend Login page with user data so it can be saved to localStorage
        const redirectUrl = `http://localhost:5173/login?token=${token}&id=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}`;
        res.redirect(redirectUrl);
    }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
    // 1. Passport's method to clear the session
    req.logout((err) => {
        if (err) { return next(err); }

        // 2. Clear the session cookie specifically
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // This is the default session cookie name

            // 3. Send a success message or redirect
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});
export default router;