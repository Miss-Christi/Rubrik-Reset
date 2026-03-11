import mongoose from "mongoose";

const challengeDaySchema = new mongoose.Schema(
    {
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true,
        },
        dayNumber: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
        },
        points: {
            type: Number,
            default: 10,
            required: true,
        },
        content: {
            reading: { type: String },
            theme: { type: String },
            reflection: { type: String },
            task: { type: String },
            youcat: { type: String },
        },
        isFinalDay: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Ensure a challenge doesn't have duplicate day numbers
challengeDaySchema.index({ challenge: 1, dayNumber: 1 }, { unique: true });

const ChallengeDay = mongoose.model("ChallengeDay", challengeDaySchema);

export default ChallengeDay;
