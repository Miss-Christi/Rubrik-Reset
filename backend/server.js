import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// Create Admin User Manually if not exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@test.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@test.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
      });
      console.log("✓ Admin user created: admin@test.com / admin123");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser();

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
