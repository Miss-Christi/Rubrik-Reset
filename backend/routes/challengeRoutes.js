import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import Challenge from "../models/Challenge.js";
import ChallengeDay from "../models/ChallengeDay.js";
import UserChallenge from "../models/UserChallenge.js";
import UserChallengeDay from "../models/UserChallengeDay.js";

const router = express.Router();

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const challenges = await Challenge.find({});
        res.json(challenges);
    })
);

// @desc    Get challenge by ID (with its days and current user progress if logged in)
// @route   GET /api/challenges/:id
// @access  Public (Progress is extra if logged in, handled partly in frontend but we can return basic days)
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            res.status(404);
            throw new Error("Challenge not found");
        }
        
        // Fetch all days associated with this challenge
        const days = await ChallengeDay.find({ challenge: challenge._id }).sort({ dayNumber: 1 });
        
        res.json({
            challenge,
            days,
        });
    })
);

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
router.post(
    "/:id/join",
    protect,
    asyncHandler(async (req, res) => {
        const challengeId = req.params.id;
        
        // Check if challenge exists
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            res.status(404);
            throw new Error("Challenge not found");
        }

        // Check if already joined
        const existingJoin = await UserChallenge.findOne({
            user: req.user._id,
            challenge: challengeId,
        });

        if (existingJoin) {
            res.status(400);
            throw new Error("You have already joined this challenge.");
        }

        const userChallenge = await UserChallenge.create({
            user: req.user._id,
            challenge: challengeId,
            status: "active",
            totalPoints: 0,
            completedDays: 0,
        });

        res.status(201).json(userChallenge);
    })
);

// @desc    Get user progress for a specific challenge
// @route   GET /api/challenges/:id/progress
// @access  Private
router.get(
    "/:id/progress",
    protect,
    asyncHandler(async (req, res) => {
        const challengeId = req.params.id;

        const userChallenge = await UserChallenge.findOne({
            user: req.user._id,
            challenge: challengeId
        });

        if (!userChallenge) {
            return res.json({ joined: false });
        }

        const completedDays = await UserChallengeDay.find({
            user: req.user._id,
        }).populate({
            path: 'challengeDay',
            match: { challenge: challengeId }
        });

        // Filter out completed days that don't belong to this challenge (due to populate match)
        const validCompletedDays = completedDays.filter(d => d.challengeDay !== null);

        res.json({
            joined: true,
            userChallenge,
            completedDayIds: validCompletedDays.map(d => d.challengeDay._id)
        });
    })
);

// @desc    Submit a daily task for a challenge
// @route   POST /api/challenges/:id/days/:dayId/submit
// @access  Private
router.post(
    "/:id/days/:dayId/submit",
    protect,
    asyncHandler(async (req, res) => {
        const { id: challengeId, dayId } = req.params;
        const { submissionText } = req.body;

        const userChallenge = await UserChallenge.findOne({
            user: req.user._id,
            challenge: challengeId,
        });

        if (!userChallenge) {
            res.status(400);
            throw new Error("You must join the challenge first");
        }

        const challengeDay = await ChallengeDay.findOne({
            _id: dayId,
            challenge: challengeId,
        });

        if (!challengeDay) {
            res.status(404);
            throw new Error("Challenge day not found");
        }

        const existingSubmission = await UserChallengeDay.findOne({
            user: req.user._id,
            challengeDay: dayId,
        });

        if (existingSubmission) {
            res.status(400);
            throw new Error("You have already completed this day");
        }

        // Create submission
        const submission = await UserChallengeDay.create({
            user: req.user._id,
            challengeDay: dayId,
            submissionText: submissionText || "",
            pointsEarned: challengeDay.points,
        });

        // Update overall user challenge points and days
        userChallenge.totalPoints += challengeDay.points;
        userChallenge.completedDays += 1;
        
        if (challengeDay.isFinalDay) {
            userChallenge.status = "completed";
        }

        await userChallenge.save();

        res.status(201).json(submission);
    })
);

// @desc    Get leaderboard for a challenge
// @route   GET /api/challenges/:id/leaderboard
// @access  Public
router.get(
    "/:id/leaderboard",
    asyncHandler(async (req, res) => {
        const challengeId = req.params.id;

        const leaderboard = await UserChallenge.find({ challenge: challengeId })
            .populate("user", "name")
            .sort({ totalPoints: -1 })
            .limit(50); // top 50

        res.json(leaderboard);
    })
);

export default router;
