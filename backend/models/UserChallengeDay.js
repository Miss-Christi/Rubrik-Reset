import mongoose from "mongoose";

const userChallengeDaySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        challengeDay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChallengeDay",
            required: true,
        },
        status: {
            type: String,
            enum: ["completed", "missed"],
            default: "completed",
        },
        submissionText: {
            type: String,
        },
        pointsEarned: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

// A user can only complete a specific day once
userChallengeDaySchema.index({ user: 1, challengeDay: 1 }, { unique: true });

const UserChallengeDay = mongoose.model("UserChallengeDay", userChallengeDaySchema);

export default UserChallengeDay;
