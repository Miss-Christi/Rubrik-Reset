import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: String, default: "Rubrik Reset Team" },
    category: { type: String, default: "Reflection" },
    readTime: { type: String, default: "5 min read" }
}, { timestamps: true });

export default mongoose.model("Reflection", reflectionSchema);
