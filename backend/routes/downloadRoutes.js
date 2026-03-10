import express from 'express';
const router = express.Router();
import Purchase from '../models/Purchase.js';

// THE SECURE DOWNLOAD ROUTE
router.get('/secure-download/:purchaseId', async (req, res) => {
    try {
        // Populate productId to get the fileUrl and Title
        const purchase = await Purchase.findById(req.params.purchaseId).populate('productId');

        if (!purchase) {
            return res.status(404).json({ message: "Download record not found." });
        }

        // RULE: Check Attempt Limit
        if (purchase.downloadCount >= purchase.maxDownloadLimit) {
            return res.status(403).json({ message: "Download limit reached (3 attempts max)." });
        }

        // RULE: Check Expiry Date
        const now = new Date();
        if (now > purchase.expiryDate) {
            return res.status(403).json({ message: "This link has expired." });
        }

        // LOGIC: Increment count in MongoDB
        purchase.downloadCount += 1;
        await purchase.save();

        // DO: Clear File Naming (e.g., Peace_Poster_HighRes.pdf)
        const professionalName = `${purchase.productId.title.replace(/\s+/g, '_')}_HighRes.pdf`;

        // Redirect to the actual file (S3/Cloudinary) or send file directly
        // If fileUrl is a remote link:
        res.redirect(purchase.productId.fileUrl);

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ message: "Server error during download." });
    }
});

export default router;