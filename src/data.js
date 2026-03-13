// --- STORE PRODUCTS (Physical) ---
export const NEW_ARRIVALS = [
  {
    id: 1,
    title: "GROWTH Compass color bullet journal",
    price: "399",
    rating: 5,
    category: "Lenten Journal",
    description: "A beautifully structured bullet journal to help you track your spiritual growth, goals, and daily reflections throughout the Lenten season.",
    // Image: Crown of thorns / Purple fabric
    image: "/products/Growth_Compass_1.jpeg"
  },
  {
    id: 2,
    title: "Vision Board",
    price: "499",
    rating: 5,
    category: "Book",
    description: "A powerful tool to visually map out your prayers, aspirations, and stepping stones building towards a disciplined life of faith.",
    // Image: Statue of Mary / Blue Aesthetic
    image: "/products/Vision_Board.jpeg"
  },
  {
    id: 3,
    title: "Word In Me Bible memory journal",
    price: "450",
    rating: 5,
    category: "Adoration Journal",
    description: "Designed specifically for adoration, this journal provides guided prompts to help you memorize scripture and meditate on the Word.",
    // Image: Monstrance / Candlelight
    image: "/products/Word_In-Me_Journal.jpeg"
  },
  {
    id: 4,
    title: "A3 Wall weekly planner",
    price: "249",
    rating: 4,
    category: "Stationery",
    description: "A minimalistic A3 weekly planner to help you organize your schedule, integrating your faith commitments with daily practicalities.",
    // Image: Aesthetic handwritten letters
    image: "/products/A3_Weekly_Planner_2.jpeg"
  },
  {
    id: 5,
    title: "Growth Compass free printable sheets",
    price: "1200",
    rating: 5,
    category: "Gift Kit",
    description: "A comprehensive bundle of printable sheets designed to complement your Growth Compass journal with additional layouts and trackers.",
    // Image: Rustic table with bible and coffee
    image: "/products/Rubrik_Free_Resources.jpeg"
  }
];

// --- FORMATION CHALLENGES (Digital) ---
export const FORMATION_CHALLENGES = [
  {
    id: 102,
    title: "100-Day YouCat Challenge",
    rating: 5,
    category: "Challenge",
    duration: "100 Days",
    description: "Commit to deepening your knowledge of the faith by reading and engaging with the Youth Catechism in manageable daily segments over 100 days.",
    modules: [
      { title: "Day 1: What we believe", description: "The foundations of faith.", locked: false },
      { title: "Day 2: The Creed", description: "Detailed breakdown of the Apostle's Creed.", locked: true },
      { title: "Day 3: The Sacraments", description: "Understanding visible signs of invisible grace.", locked: true },
      { title: "Day 4: Moral Life", description: "Living out the commandments.", locked: true }
    ],
    // Image: Reading a book intently
    image: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 103,
    title: "40-Day Lenten Novena",
    rating: 5,
    category: "Novena",
    duration: "40 Days",
    description: "A guided 40-day prayer journey through the Lenten season, featuring daily reflections and focused intentions to prepare your heart for Easter.",
    modules: [
      { title: "Week 1: Repentance", description: "Acknowledging our shortcomings.", locked: false },
      { title: "Week 2: Detachment", description: "Letting go of worldly desires.", locked: true },
      { title: "Week 3: Suffering", description: "Uniting our pain with the Cross.", locked: true },
      { title: "Week 4: Preparation", description: "Preparing the heart for the Resurrection.", locked: true }
    ],
    // Image: Rosary beads
    image: "/Formation_Challenges/Lent Challenge.jpg"
  },
  {
    id: 104,
    title: "40 Days Consecration to St Joseph",
    rating: 4,
    category: "Course",
    duration: "40 Days",
    description: "A profound spiritual journey to consecrate yourself to St. Joseph, learning from his virtues of silence, the strength of faith, and protective love.",
    modules: [
      { title: "The Silent Worker", description: "Learning from Joseph's quiet obedience.", locked: false },
      { title: "Protector of the Holy Family", description: "Valuing family and stewardship.", locked: true },
      { title: "Terror of Demons", description: "Spiritual warfare through humility.", locked: true },
      { title: "Consecration Day", description: "The final prayer of consecration.", locked: true }
    ],
    // Image: Plant/Nature
    image: "/Formation_Challenges/St_Joseph_Novena.jpg"
  },
  {
    id: 105,
    title: "Train the Trainer Batch 3",
    rating: 5,
    category: "Workshop",
    duration: "Half Day",
    description: "Understand the YOUCAT DNA principles, charism, and get hands-on experience with YOUCAT tools. Build new tools and see best practices.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/Train_the_Trainer_Batch_3.png"
  },
  {
    id: 106,
    title: "YOUCAT Barefoot Missionary",
    rating: 5,
    category: "Mission",
    duration: "2 Years",
    description: "Read the YOUCAT + DOCAT + Bible in 2 years. Do mission with the YOUCAT charism in your context and learn to pray with the saints.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/YOUCAT_Barefoot_Missionary.png"
  },
  {
    id: 107,
    title: "YOUCAT Creatives ABCD Module",
    rating: 5,
    category: "Course",
    duration: "Self-paced",
    description: "Train YOUCAT Creatives to design digital content like posters, reels, blogs, and newsletters aligning to the books and charism of YOUCAT.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/YOUCAT_Creatives_ABCD.png"
  },
  {
    id: 108,
    title: "YOUCAT Starter",
    rating: 5,
    category: "Course",
    duration: "Self-paced",
    description: "The best starter course to get you kickstarted with key facts about the YOUCAT charism and how to use the books! Includes simple digital tools.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/YouCat_Starter.png"
  },
  {
    id: 109,
    title: "Worship Rubrics Workshop",
    rating: 5,
    category: "Workshop",
    duration: "15 Sessions",
    description: "Learn worship leading, song selection, charisms in worship, liturgical and personal worship throughout 15 online sessions.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/Worship_Rubrics_Workshop.png"
  },
  {
    id: 110,
    title: "DOCAT - How to manage your money",
    rating: 5,
    category: "Mentoring",
    duration: "6 Months",
    description: "6 month mentoring framework with materials shared on Whatsapp and one-to-one mentoring by a Chartered Accountant to make a personal investment plan.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/DOCAT How to manage your money.png"
  },
  {
    id: 111,
    title: "YOUCAT Parish/Youth group Program Kit",
    rating: 5,
    category: "Toolkit",
    duration: "1 Year",
    price: "506",
    description: "Resources to run YOUCAT for one year in a parish or youth group setting. Includes monthly zoom training for leaders.",
    isBooking: false,
    image: "/Formation_Challenges/YOUCAT_Parish_group_Program_Kit.png"
  },
  {
    id: 112,
    title: "The Precious Blood prayer challenge",
    rating: 5,
    category: "Challenge",
    duration: "Multi-day",
    description: "Do you need a life reset? Pray the precious blood prayer on each bead of the rosary to receive tangible grace. 31 checkpoints.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/The_Precious_Blood_prayer_challenge.png"
  },
  {
    id: 113,
    title: "The Precious Blood prayer challenge - 2",
    rating: 5,
    category: "Challenge",
    duration: "Multi-day",
    description: "Do you feel stagnant? Pray the words 'Most precious blood of Jesus Christ, save us and the whole world' for 31 checkpoints.",
    price: "0",
    isBooking: false,
    image: "/Formation_Challenges/The_Precious_Blood_prayer_challenge.png"
  },
  {
    id: 114,
    title: "DOCAT Financial Planning Mentoring with an expert",
    rating: 5,
    category: "1:1 Session",
    duration: "45 mins",
    price: "51",
    description: "Learn why it is important to start saving early, the Catholic way to handle money, and clarify doubts with your personal income. (Select a date slot when checking out).",
    isBooking: true,
    image: "/Formation_Challenges/DOCAT_Financial_Planning.png"
  }
];

// --- BLOG POSTS ---
export const BLOG_POSTS = [
  {
    id: 1,
    title: "Revisiting the Basics",
    excerpt: "In a fast-paced world, going back to the core values of our faith is not regression, it's a reset.",
    content: "<h2>The Illusion of Progress</h2><p>In a world obsessed with 'what's next', there is a profound counter-cultural peace in asking 'what's always been'. We often confuse movement with progress.</p><h2>Revisiting the Core</h2><p>When we talk about a 'reset', we aren't talking about going backward. We are talking about clearing the cache. Stripping away the excess to find the solid rock beneath. The core values of faith, community, and stewardship are not outdated; they are the bedrock upon which any sustainable future is built.</p><blockquote>\"You cannot build a skyscraper on a cracked foundation.\"</blockquote><p>Take time this week to assess your spiritual foundation. Are the basics in place? Daily prayer, regular sacraments, and genuine community?</p>",
    date: "Jan 10, 2026",
    category: "Reflection",
    image: "/Revisiting_the_Basics.jpg"
  },
  {
    id: 2,
    title: "Stewardship in the Digital Age",
    excerpt: "How do we manage our digital presence with the same care we give our physical communities?",
    content: "<h2>Digital Asceticism</h2><p>Stewardship is traditionally discussed in terms of time, talent, and treasure. Today, we must add a fourth 'T': Technology.</p><h2>Guarding Your Gaze</h2><p>Your attention is a finite resource. Every scroll, every notification, every infinite feed is competing for a piece of your consciousness. To practice stewardship in the digital age means to be fiercely intentional about where your gaze lingers.</p><h3>Practical Steps:</h3><ul><li>Set screen time limits for social media.</li><li>Do not look at your phone for the first hour of the day.</li><li>Unfollow accounts that do not lead you closer to truth, beauty, and goodness.</li></ul>",
    date: "Jan 05, 2026",
    category: "Digital",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "True Community",
    excerpt: "More than a group chat: True community requires vulnerability, presence, and a willingness to walk together.",
    content: "<h2>The Loneliness Epidemic</h2><p>We are the most connected generation in history, yet we are experiencing unprecedented levels of loneliness. Why? Because connectivity is not communion.</p><h2>Incarnational Presence</h2><p>True community demands physical presence. It demands the uncomfortable reality of dealing with other people's flaws face-to-face, and allowing them to deal with yours.</p><p>We must transition our relationships from the sterile environment of group chats into the messy reality of shared meals, shared struggles, and shared prayer. That is where sanctification happens.</p>",
    date: "Dec 28, 2025",
    category: "Community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop"
  },
];