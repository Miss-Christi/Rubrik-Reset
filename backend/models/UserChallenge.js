import mongoose from "mongoose";

const userChallengeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "completed", "dropped"],
            default: "active",
        },
        totalPoints: {
            type: Number,
            default: 0,
        },
        completedDays: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only have one active/completed record per challenge
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

const UserChallenge = mongoose.model("UserChallenge", userChallengeSchema);

export default UserChallenge;
