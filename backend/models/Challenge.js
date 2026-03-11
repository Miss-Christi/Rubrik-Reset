import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
