import express from 'express';
import passport from 'passport';

const router = express.Router();

// @desc    Authenticate with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback (The return trip)
// @route   GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful login! Redirect to your frontend dashboard
        // Use your real frontend URL here (like http://localhost:5175/dashboard)
        res.redirect('http://localhost:5175/dashboard');
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