import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport"; // Added
import session from "express-session"; // Added
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import googleAuthRoutes from "./routes/auth.js"; // Added (Assuming your new file is routes/auth.js)
import userRoutes from "./routes/userRoutes.js"; // Added
import messageRoutes from "./routes/messageRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import User from "./models/User.js";
import passportConfig from "./config/passport.js"; // Added

dotenv.config();

connectDB();

const app = express();

// Initialize Passport Config
passportConfig(passport);

// Updated CORS configuration for credentials and specific origin
app.use(cors({
  origin: "http://localhost:5175", // Your React/Vite port
  credentials: true                // THIS IS MANDATORY FOR COOKIES
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware (Required for Google OAuth)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes); // Added
app.use("/api/downloads", downloadRoutes);
app.use("/auth", googleAuthRoutes); // Added for Google Auth
app.use("/api/messages", messageRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/wishlist", wishlistRoutes);

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