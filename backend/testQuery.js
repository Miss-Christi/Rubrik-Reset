import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const checkData = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        console.log(`Found ${products.length} products in collection '${Product.collection.name}'.`);
        console.log(products);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
