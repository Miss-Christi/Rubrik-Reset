import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
    itemType: { type: String, required: true, enum: ['Product', 'Challenge'] },
    downloadCount: { type: Number, default: 0 },
    maxDownloadLimit: { type: Number, default: 3 },
    expiryDate: { type: Date },
    purchaseDate: { type: Date, default: Date.now }
});

export default mongoose.model('Purchase', purchaseSchema);