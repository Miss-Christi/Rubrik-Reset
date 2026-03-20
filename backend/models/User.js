import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () { return !this.googleId; }, // Required only if not using Google Auth
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        phone: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        landmark: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        wishlistedProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        wishlistedChallenges: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        }],
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.log(error);
        throw error;
    }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
