import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const importData = async () => {
    try {
        console.log("Starting data import...");

        // Physical Products
        const NEW_ARRIVALS = [
            {
                title: "GROWTH Compass color bullet journal",
                price: 399,
                category: "Lenten Journal",
                fileUrl: "https://images.unsplash.com/photo-1583383133387-075ed7150011?q=80&w=800&auto=format&fit=crop",
            },
            {
                title: "Vision Board",
                price: 499,
                category: "Book",
                fileUrl: "https://images.unsplash.com/photo-1605353132645-0d33e69eb858?q=80&w=800&auto=format&fit=crop",
            },
            {
                title: "Word In Me Bible memory journal",
                price: 450,
                category: "Adoration Journal",
                fileUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop",
            },
            {
                title: "A3 Wall weekly planner",
                price: 249,
                category: "Stationery",
                fileUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop",
            },
            {
                title: "Growth Compass free printable sheets",
                price: 1200,
                category: "Gift Kit",
                fileUrl: "https://images.unsplash.com/photo-1496483526623-c048295f832e?q=80&w=800&auto=format&fit=crop",
            },
            {
                title: "Community Tee",
                price: 600,
                category: "Apparel",
                fileUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
            }
        ];

        // Digital Challenges
        const FORMATION_CHALLENGES = [
            {
                title: "Little Steps Community",
                price: 0,
                category: "Challenge",
                fileUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
                days: 999
            },
            {
                title: "100-Day YouCat Challenge",
                price: 0,
                category: "Challenge",
                fileUrl: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9",
                days: 100
            },
            {
                title: "40-Day Lenten Novena",
                price: 0,
                category: "Challenge",
                fileUrl: "https://images.unsplash.com/photo-1505506927361-b84175396652",
                days: 40
            },
            {
                title: "40 Days Consecration to St Joseph",
                price: 0,
                category: "Challenge",
                fileUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
                days: 40
            },
        ];

        // Clear existing products to prevent duplicates if run multiple times
        await Product.deleteMany();
        console.log("Cleared existing products from database.");

        // Insert all arrays
        await Product.insertMany([...NEW_ARRIVALS, ...FORMATION_CHALLENGES]);

        console.log("Data Import Success!");
        process.exit();
    } catch (error) {
        console.error(`Error with import: ${error.message}`);
        process.exit(1);
    }
};

importData();
