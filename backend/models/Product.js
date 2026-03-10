import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL to your S3/Cloudinary file
    price: { type: Number, required: true },
    category: { type: String, required: true }
});

export default mongoose.model("Product", productSchema);