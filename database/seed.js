const prisma = require("./prisma");
const bcrypt = require("bcryptjs");

async function main() {
  const USER_NUMBER = 10;
  const ADMIN_PASSWORD = await bcrypt.hash("LockeyDockeyHockey123", 10);
  const PASSWORD = await bcrypt.hash("Password1", 10);

  // CREATE REF DATA (CATEGORIES, RANGE OF PRICES ETC.)
  // Category
  const categoryData = [
    "All",
    "Self-Discovery",
    "Art",
    "Cooking",
    "Creativity",
    "Sports",
    "Travel",
    "Technology",
    "Music",
    "Internet",
  ];

  // GroupSize
  const groupSizeData = [
    { label: "1", min: 1, max: 1 },
    { label: "2", min: 2, max: 2 },
    { label: "3-5", min: 3, max: 5 },
    { label: ">6", min: 6, max: null },
  ];

  // Duration (in minutes)
  const durationData = [
    { label: "0-15", min: 0, max: 15 },
    { label: "15-30", min: 15, max: 30 },
    { label: "30-60", min: 30, max: 60 },
    { label: "60-120", min: 60, max: 120 },
    { label: "120-480", min: 120, max: 480 },
    { label: "Day", min: 480, max: 1440 }, // 8h - 24h
    { label: "Weekend", min: 1440, max: 4320 }, // 1d - 3d
  ];

  // PriceRange (in Euro)
  const priceRangeData = [
    { label: "Free", min: 0, max: 0 },
    { label: "1-5", min: 1, max: 5 },
    { label: "5-15", min: 5, max: 15 },
    { label: "15-30", min: 15, max: 30 },
    { label: "30-60", min: 30, max: 60 },
    { label: "60-240", min: 60, max: 240 },
    { label: "240-1000", min: 240, max: 1000 },
    { label: "Premium", min: 1000, max: null },
  ];

  // User (1 demo account + 1 admin account + X random)
  const userData = [
    {
      username: "DemoUser",
      email: "demouser@gmail.com",
      password: PASSWORD,
      role: "USER",
    },
    {
      username: "Admin",
      email: "admin@gmail.com",
      password: ADMIN_PASSWORD,
      role: "ADMIN",
    },
  ];

  for (let i = 1; i <= USER_NUMBER; i++) {
    let user = {
      username: `TestUser${i}`,
      email: `TestUser${i}@gmail.com`,
      password: PASSWORD,
      role: "USER",
    };
    userData.push(user);
  }

  // Create reference data
  for (const item of categoryData) {
    await prisma.category.create({ data: { label: item } });
  }

  for (const item of durationData) {
    await prisma.duration.create({
      data: { label: item.label, min: item.min, max: item.max },
    });
  }

  for (const item of groupSizeData) {
    await prisma.groupSize.create({
      data: { label: item.label, min: item.min, max: item.max },
    });
  }

  for (const item of priceRangeData) {
    await prisma.priceRange.create({
      data: { label: item.label, min: item.min, max: item.max },
    });
  }

  // Create users
  for (const item of userData) {
    await prisma.user.create({
      data: {
        email: item.email,
        username: item.username,
        password: item.password,
        role: item.role,
      },
    });
  }

  // Get created data for references
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const durations = await prisma.duration.findMany();
  const groupSizes = await prisma.groupSize.findMany();
  const priceRanges = await prisma.priceRange.findMany();

  // Ideas data
  const ideaData = [
    {
      title: "Weekend Photography Walk",
      description:
        "Explore your city with a camera and discover hidden gems. Perfect for beginners and pros alike.",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Art", "Travel"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Cook a New Recipe Every Week",
      description:
        "Challenge yourself to try cuisines from around the world. Document your culinary journey!",
      isActive: true,
      isChallenge: true,
      locationType: "INDOOR",
      categories: ["Cooking", "Creativity"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Digital Detox Weekend",
      description:
        "Disconnect from technology and reconnect with yourself. Read, meditate, or just enjoy nature.",
      isActive: true,
      isChallenge: true,
      locationType: "FLEXIBLE",
      categories: ["Self-Discovery"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Learn a Musical Instrument",
      description:
        "Pick up that guitar, piano, or ukulele you've been thinking about. Start with just 15 minutes a day.",
      isActive: true,
      isChallenge: false,
      locationType: "INDOOR",
      categories: ["Music", "Creativity"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Morning Jogging Routine",
      description:
        "Start your day with energy! Begin with short distances and gradually increase your pace.",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Sports"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Build a Personal Website",
      description:
        "Create your own corner of the internet. Learn HTML, CSS, and showcase your personality online.",
      isActive: true,
      isChallenge: false,
      locationType: "INDOOR",
      categories: ["Technology", "Creativity"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Urban Sketching Adventure",
      description:
        "Grab a sketchbook and draw what you see around you. Cafes, buildings, people - capture life!",
      isActive: true,
      isChallenge: false,
      locationType: "HYBRID",
      categories: ["Art", "Creativity"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Start a YouTube Channel",
      description:
        "Share your passion with the world! Whether it's gaming, cooking, or vlogs - just start creating.",
      isActive: true,
      isChallenge: true,
      locationType: "INDOOR",
      categories: ["Internet", "Technology", "Creativity"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Local Food Truck Tour",
      description:
        "Discover the best street food in your area. Try something new every weekend!",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Cooking", "Travel"],
      viewCount: Math.floor(Math.random() * 100),
    },
    {
      title: "Meditation Challenge",
      description:
        "Find inner peace with daily meditation. Start with 5 minutes and work your way up to longer sessions.",
      isActive: true,
      isChallenge: true,
      locationType: "FLEXIBLE",
      categories: ["Self-Discovery"],
      viewCount: Math.floor(Math.random() * 100),
    },
  ];

  // Create ideas
  const createdIdeas = [];
  for (let i = 0; i < ideaData.length; i++) {
    const idea = ideaData[i];
    const randomAuthor = users[Math.floor(Math.random() * users.length)];
    const randomDuration =
      durations[Math.floor(Math.random() * durations.length)];
    const randomGroupSize =
      groupSizes[Math.floor(Math.random() * groupSizes.length)];
    const randomPriceRange =
      priceRanges[Math.floor(Math.random() * priceRanges.length)];

    // Get category objects for connection
    const ideaCategories = categories.filter((cat) =>
      idea.categories.includes(cat.label),
    );

    const createdIdea = await prisma.idea.create({
      data: {
        title: idea.title,
        description: idea.description,
        isActive: idea.isActive,
        isChallenge: idea.isChallenge,
        locationType: idea.locationType,
        viewCount: idea.viewCount,
        authorId: randomAuthor.id,
        durationId: randomDuration.id,
        priceRangeId: randomPriceRange.id,
      },
    });

    // Create category links
    for (const category of ideaCategories) {
      await prisma.categoryToIdea.create({
        data: {
          ideaId: createdIdea.id,
          categoryId: category.id,
        },
      });
    }

    // Create group size link
    await prisma.groupSizeToIdea.create({
      data: {
        ideaId: createdIdea.id,
        groupSizeId: randomGroupSize.id,
      },
    });

    createdIdeas.push(createdIdea);
  }

  // Create reviews (5 per user)
  for (const user of users) {
    if (user.role === "ADMIN") continue; // Skip admin for reviews

    const shuffledIdeas = [...createdIdeas].sort(() => 0.5 - Math.random());
    const ideasToReview = shuffledIdeas.slice(0, 5);

    for (const idea of ideasToReview) {
      await prisma.review.create({
        data: {
          rating: Math.floor(Math.random() * 5) + 1, // 1-5 stars
          authorId: user.id,
          ideaId: idea.id,
        },
      });
    }
  }

  // Create comments (2 per user)
  const commentTexts = [
    "This looks really interesting! I might try it this weekend.",
    "Great idea! I've been looking for something like this.",
    "Thanks for sharing, this is exactly what I needed.",
    "I tried something similar and it was amazing!",
    "Love this concept, very creative!",
    "This could be really fun with friends.",
    "Simple but effective, I like it!",
    "Definitely adding this to my todo list.",
    "Such a refreshing idea, thanks!",
    "This reminds me of something I used to do as a kid.",
    "Perfect for beginners like me!",
    "I wish I had thought of this earlier.",
    "This could be a great stress reliever.",
    "Looks challenging but worth it!",
    "Great way to spend free time!",
  ];

  for (const user of users) {
    if (user.role === "ADMIN") continue; // Skip admin for comments

    const shuffledIdeas = [...createdIdeas].sort(() => 0.5 - Math.random());
    const ideasToComment = shuffledIdeas.slice(0, 2);

    for (const idea of ideasToComment) {
      const randomComment =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];

      await prisma.comment.create({
        data: {
          description: randomComment,
          authorId: user.id,
          ideaId: idea.id,
        },
      });
    }
  }

  // Create user idea statuses (random statuses for ideas)
  const statusTypes = ["TODO", "IN_PROGRESS", "COMPLETED", "FAVORITED"];

  for (const user of users) {
    if (user.role === "ADMIN") continue;

    // Each user gets 3-7 random statuses
    const statusCount = Math.floor(Math.random() * 5) + 3;
    const shuffledIdeas = [...createdIdeas].sort(() => 0.5 - Math.random());
    const ideasForStatus = shuffledIdeas.slice(0, statusCount);

    for (const idea of ideasForStatus) {
      const randomStatus =
        statusTypes[Math.floor(Math.random() * statusTypes.length)];

      await prisma.userIdeaStatus.create({
        data: {
          ideaStatus: randomStatus,
          userId: user.id,
          ideaId: idea.id,
        },
      });
    }
  }

  // Update average ratings for ideas
  for (const idea of createdIdeas) {
    const reviews = await prisma.review.findMany({
      where: { ideaId: idea.id },
    });

    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

      await prisma.idea.update({
        where: { id: idea.id },
        data: {
          averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
          completionCount: Math.floor(Math.random() * 50), // Random completion count
        },
      });
    }
  }

  // Create some user follows (random relationships)
  const regularUsers = users.filter((u) => u.role === "USER");
  for (let i = 0; i < 15; i++) {
    // Create 15 random follow relationships
    const follower =
      regularUsers[Math.floor(Math.random() * regularUsers.length)];
    const following =
      regularUsers[Math.floor(Math.random() * regularUsers.length)];

    if (follower.id !== following.id) {
      try {
        await prisma.userFollow.create({
          data: {
            followerId: follower.id,
            followingId: following.id,
          },
        });
      } catch (error) {
        // Skip if relationship already exists
        continue;
      }
    }
  }

  console.log("🌱 Database seeded successfully!");
  console.log(`Created:`);
  console.log(`- ${users.length} users`);
  console.log(`- ${createdIdeas.length} ideas`);
  console.log(`- Reviews, comments, and statuses for all users`);
  console.log(`- Random follow relationships`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
