import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "./models/Challenge.js";

dotenv.config();

const challengesData = [
  {
    title: "Little Steps Community",
    rating: 5,
    category: "Membership",
    duration: "Ongoing",
    description: "Join a vibrant, supportive community focused on taking small, intentional steps together towards holistic spiritual and personal growth.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "100-Day YouCat Challenge",
    rating: 5,
    category: "Challenge",
    duration: "100 Days",
    description: "Commit to deepening your knowledge of the faith by reading and engaging with the Youth Catechism in manageable daily segments over 100 days.",
    image: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "40-Day Lenten Novena",
    rating: 5,
    category: "Novena",
    duration: "40 Days",
    description: "A guided 40-day prayer journey through the Lenten season, featuring daily reflections and focused intentions to prepare your heart for Easter.",
    image: "https://images.unsplash.com/photo-1505506927361-b84175396652?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "40 Days Consecration to St Joseph",
    rating: 4,
    category: "Course",
    duration: "40 Days",
    description: "A profound spiritual journey to consecrate yourself to St. Joseph, learning from his virtues of silence, the strength of faith, and protective love.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Train the Trainer Batch 3",
    rating: 5,
    category: "Workshop",
    duration: "Half Day",
    description: "Understand the YOUCAT DNA principles, charism, and get hands-on experience with YOUCAT tools. Build new tools and see best practices.",
    price: "0", 
    isBooking: false,
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "YOUCAT Barefoot Missionary",
    rating: 5,
    category: "Mission",
    duration: "2 Years",
    description: "Read the YOUCAT + DOCAT + Bible in 2 years. Do mission with the YOUCAT charism in your context and learn to pray with the saints.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "YOUCAT Creatives ABCD Module",
    rating: 5,
    category: "Course",
    duration: "Self-paced",
    description: "Train YOUCAT Creatives to design digital content like posters, reels, blogs, and newsletters aligning to the books and charism of YOUCAT.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "YOUCAT Starter",
    rating: 5,
    category: "Course",
    duration: "Self-paced",
    description: "The best starter course to get you kickstarted with key facts about the YOUCAT charism and how to use the books! Includes simple digital tools.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Worship Rubrics Workshop",
    rating: 5,
    category: "Workshop",
    duration: "15 Sessions",
    description: "Learn worship leading, song selection, charisms in worship, liturgical and personal worship throughout 15 online sessions.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "DOCAT - How to manage your money",
    rating: 5,
    category: "Mentoring",
    duration: "6 Months",
    description: "6 month mentoring framework with materials shared on Whatsapp and one-to-one mentoring by a Chartered Accountant to make a personal investment plan.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "YOUCAT Parish/Youth group Program Kit",
    rating: 5,
    category: "Toolkit",
    duration: "1 Year",
    price: "506",
    description: "Resources to run YOUCAT for one year in a parish or youth group setting. Includes monthly zoom training for leaders.",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The Precious Blood prayer challenge",
    rating: 5,
    category: "Challenge",
    duration: "Multi-day",
    description: "Do you need a life reset? Pray the precious blood prayer on each bead of the rosary to receive tangible grace. 31 checkpoints.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1505506927361-b84175396652?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The Precious Blood prayer challenge - 2",
    rating: 5,
    category: "Challenge",
    duration: "Multi-day",
    description: "Do you feel stagnant? Pray the words 'Most precious blood of Jesus Christ, save us and the whole world' for 31 checkpoints.",
    price: "0",
    isBooking: false,
    image: "https://images.unsplash.com/photo-1605353132645-0d33e69eb858?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "DOCAT Financial Planning Mentoring with an expert",
    rating: 5,
    category: "1:1 Session",
    duration: "45 mins",
    price: "51",
    description: "Learn why it is important to start saving early, the Catholic way to handle money, and clarify doubts with your personal income. (Select a date slot when checking out).",
    isBooking: true,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected for Migration");

        // ONLY clear Challenges from db
        await Challenge.deleteMany();
        console.log("Cleared existing Challenges from MongoDB");

        for (const data of challengesData) {
            const newChallenge = await Challenge.create({
                title: data.title,
                category: data.category,
                duration: data.duration,
                description: data.description,
                image: data.image
            });

            console.log(`Created challenges and days for: ${newChallenge.title}`);
        }

        console.log("Data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error migrating data: ", error);
        process.exit(1);
    }
};

seedDB();
