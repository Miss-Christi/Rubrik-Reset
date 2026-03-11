import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "./models/Challenge.js";
import ChallengeDay from "./models/ChallengeDay.js";

dotenv.config();

const challengesData = [
  {
    title: "100-Day YouCat Challenge",
    category: "Challenge",
    duration: "100 Days",
    description: "Commit to deepening your knowledge of the faith by reading and engaging with the Youth Catechism in manageable daily segments over 100 days.",
    image: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=800&auto=format&fit=crop",
    days: [
      { dayNumber: 1, content: { reading: "Matthew 1-3", theme: "Beginnings", reflection: "The Gospel begins...", task: "Reflect on a new beginning.", youcat: "YOUCAT 196..." } },
      { dayNumber: 2, content: { reading: "Matthew 4-6", theme: "Temptation", reflection: "Jesus in the desert...", task: "Identify a temptation.", youcat: "YOUCAT 197..." } },
      { dayNumber: 3, content: { reading: "Matthew 7-9", theme: "Healing", reflection: "Jesus heals...", task: "Pray for someone sick.", youcat: "YOUCAT 198..." } },
    ]
  },
  {
    title: "40-Day Lenten Novena",
    category: "Novena",
    duration: "40 Days",
    description: "A guided 40-day prayer journey through the Lenten season, featuring daily reflections and focused intentions to prepare your heart for Easter.",
    image: "https://images.unsplash.com/photo-1505506927361-b84175396652?q=80&w=800&auto=format&fit=crop",
    days: [
      { dayNumber: 1, content: { reading: "Joel 2", theme: "Repentance", reflection: "Return to the Lord...", task: "Go to confession.", youcat: "YOUCAT 200..." } },
    ]
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        await Challenge.deleteMany();
        await ChallengeDay.deleteMany();

        for (const data of challengesData) {
            const newChallenge = await Challenge.create({
                title: data.title,
                category: data.category,
                duration: data.duration,
                description: data.description,
                image: data.image
            });

            const dayDocs = data.days.map((d, index) => ({
                challenge: newChallenge._id,
                dayNumber: d.dayNumber,
                points: 10,
                content: d.content,
                isFinalDay: index === data.days.length - 1
            }));

            await ChallengeDay.insertMany(dayDocs);
            console.log(`Created challenges and days for: ${newChallenge.title}`);
        }

        console.log("Data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
