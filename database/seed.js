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

  // DETERMINISTIC USER DATA
  const userData = [
    {
      username: "DemoUser",
      email: "demouser@gmail.com",
      password: PASSWORD,
      role: "USER",
      isPrivate: false,
    },
    {
      username: "Admin",
      email: "admin@gmail.com",
      password: ADMIN_PASSWORD,
      role: "ADMIN",
      isPrivate: false,
    },
    // Specific test users with known properties
    {
      username: "PublicUser1",
      email: "public1@gmail.com",
      password: PASSWORD,
      role: "USER",
      isPrivate: false,
    },
    {
      username: "PrivateUser1",
      email: "private1@gmail.com",
      password: PASSWORD,
      role: "USER",
      isPrivate: true,
    },
    {
      username: "PublicUser2",
      email: "public2@gmail.com",
      password: PASSWORD,
      role: "USER",
      isPrivate: false,
    },
    {
      username: "PrivateUser2",
      email: "private2@gmail.com",
      password: PASSWORD,
      role: "USER",
      isPrivate: true,
    },
  ];

  // Add remaining test users
  for (let i = 1; i <= USER_NUMBER; i++) {
    let user = {
      username: `TestUser${i}`,
      email: `TestUser${i}@gmail.com`,
      password: PASSWORD,
      role: "USER",
      isPrivate: i % 3 === 0, // Every 3rd user is private (predictable pattern)
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
        isPrivate: item.isPrivate,
      },
    });
  }

  // Get created data for references
  const users = await prisma.user.findMany({ orderBy: { username: "asc" } });
  const categories = await prisma.category.findMany({
    orderBy: { label: "asc" },
  });
  const durations = await prisma.duration.findMany({ orderBy: { id: "asc" } });
  const groupSizes = await prisma.groupSize.findMany({
    orderBy: { id: "asc" },
  });
  const priceRanges = await prisma.priceRange.findMany({
    orderBy: { id: "asc" },
  });

  // DETERMINISTIC IDEAS DATA
  const ideaData = [
    {
      title: "Weekend Photography Walk",
      description:
        "Explore your city with a camera and discover hidden gems. Perfect for beginners and pros alike.",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Art", "Travel"],
      viewCount: 45,
      authorIndex: 0, // DemoUser
      durationIndex: 2, // 30-60 min
      groupSizeIndex: 1, // 2 people
      priceRangeIndex: 0, // Free
    },
    {
      title: "Cook a New Recipe Every Week",
      description:
        "Challenge yourself to try cuisines from around the world. Document your culinary journey!",
      isActive: true,
      isChallenge: true,
      locationType: "INDOOR",
      categories: ["Cooking", "Creativity"],
      viewCount: 78,
      authorIndex: 2, // PublicUser1
      durationIndex: 3, // 60-120 min
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 2, // 5-15 euro
    },
    {
      title: "Digital Detox Weekend",
      description:
        "Disconnect from technology and reconnect with yourself. Read, meditate, or just enjoy nature.",
      isActive: true,
      isChallenge: true,
      locationType: "FLEXIBLE",
      categories: ["Self-Discovery"],
      viewCount: 92,
      authorIndex: 3, // PrivateUser1
      durationIndex: 6, // Weekend
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 0, // Free
    },
    {
      title: "Learn a Musical Instrument",
      description:
        "Pick up that guitar, piano, or ukulele you've been thinking about. Start with just 15 minutes a day.",
      isActive: true,
      isChallenge: false,
      locationType: "INDOOR",
      categories: ["Music", "Creativity"],
      viewCount: 34,
      authorIndex: 4, // PublicUser2
      durationIndex: 1, // 15-30 min
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 4, // 30-60 euro
    },
    {
      title: "Morning Jogging Routine",
      description:
        "Start your day with energy! Begin with short distances and gradually increase your pace.",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Sports"],
      viewCount: 67,
      authorIndex: 5, // PrivateUser2
      durationIndex: 2, // 30-60 min
      groupSizeIndex: 2, // 3-5 people
      priceRangeIndex: 1, // 1-5 euro
    },
    {
      title: "Build a Personal Website",
      description:
        "Create your own corner of the internet. Learn HTML, CSS, and showcase your personality online.",
      isActive: true,
      isChallenge: false,
      locationType: "INDOOR",
      categories: ["Technology", "Creativity"],
      viewCount: 123,
      authorIndex: 6, // TestUser1
      durationIndex: 4, // 120-480 min
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 3, // 15-30 euro
    },
    {
      title: "Urban Sketching Adventure",
      description:
        "Grab a sketchbook and draw what you see around you. Cafes, buildings, people - capture life!",
      isActive: true,
      isChallenge: false,
      locationType: "HYBRID",
      categories: ["Art", "Creativity"],
      viewCount: 56,
      authorIndex: 7, // TestUser2
      durationIndex: 2, // 30-60 min
      groupSizeIndex: 1, // 2 people
      priceRangeIndex: 1, // 1-5 euro
    },
    {
      title: "Start a YouTube Channel",
      description:
        "Share your passion with the world! Whether it's gaming, cooking, or vlogs - just start creating.",
      isActive: true,
      isChallenge: true,
      locationType: "INDOOR",
      categories: ["Internet", "Technology", "Creativity"],
      viewCount: 89,
      authorIndex: 8, // TestUser3
      durationIndex: 4, // 120-480 min
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 2, // 5-15 euro
    },
    {
      title: "Local Food Truck Tour",
      description:
        "Discover the best street food in your area. Try something new every weekend!",
      isActive: true,
      isChallenge: false,
      locationType: "OUTDOOR",
      categories: ["Cooking", "Travel"],
      viewCount: 71,
      authorIndex: 9, // TestUser4
      durationIndex: 3, // 60-120 min
      groupSizeIndex: 2, // 3-5 people
      priceRangeIndex: 3, // 15-30 euro
    },
    {
      title: "Meditation Challenge",
      description:
        "Find inner peace with daily meditation. Start with 5 minutes and work your way up to longer sessions.",
      isActive: true,
      isChallenge: true,
      locationType: "FLEXIBLE",
      categories: ["Self-Discovery"],
      viewCount: 112,
      authorIndex: 10, // TestUser5
      durationIndex: 0, // 0-15 min
      groupSizeIndex: 0, // 1 person
      priceRangeIndex: 0, // Free
    },
  ];

  // Create ideas with deterministic data
  const createdIdeas = [];
  for (let i = 0; i < ideaData.length; i++) {
    const idea = ideaData[i];

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
        authorId: users[idea.authorIndex].id,
        durationId: durations[idea.durationIndex].id,
        priceRangeId: priceRanges[idea.priceRangeIndex].id,
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
        groupSizeId: groupSizes[idea.groupSizeIndex].id,
      },
    });

    createdIdeas.push(createdIdea);
  }

  // DETERMINISTIC REVIEWS (specific ratings for testing)
  const reviewData = [
    // DemoUser reviews
    { userIndex: 0, ideaIndex: 1, rating: 5 },
    { userIndex: 0, ideaIndex: 2, rating: 4 },
    { userIndex: 0, ideaIndex: 3, rating: 3 },

    // PublicUser1 reviews
    { userIndex: 2, ideaIndex: 0, rating: 5 },
    { userIndex: 2, ideaIndex: 4, rating: 4 },
    { userIndex: 2, ideaIndex: 5, rating: 5 },

    // PrivateUser1 reviews
    { userIndex: 3, ideaIndex: 1, rating: 3 },
    { userIndex: 3, ideaIndex: 6, rating: 4 },

    // Add more deterministic reviews...
  ];

  for (const review of reviewData) {
    if (users[review.userIndex].role !== "ADMIN") {
      await prisma.review.create({
        data: {
          rating: review.rating,
          authorId: users[review.userIndex].id,
          ideaId: createdIdeas[review.ideaIndex].id,
        },
      });
    }
  }

  // DETERMINISTIC COMMENTS
  const commentData = [
    {
      userIndex: 0,
      ideaIndex: 1,
      text: "This looks really interesting! I might try it this weekend.",
    },
    {
      userIndex: 0,
      ideaIndex: 3,
      text: "Great idea! I've been looking for something like this.",
    },
    {
      userIndex: 2,
      ideaIndex: 0,
      text: "Thanks for sharing, this is exactly what I needed.",
    },
    {
      userIndex: 2,
      ideaIndex: 4,
      text: "I tried something similar and it was amazing!",
    },
    { userIndex: 3, ideaIndex: 1, text: "Love this concept, very creative!" },
    {
      userIndex: 4,
      ideaIndex: 2,
      text: "This could be really fun with friends.",
    },
    { userIndex: 5, ideaIndex: 6, text: "Simple but effective, I like it!" },
    {
      userIndex: 6,
      ideaIndex: 7,
      text: "Definitely adding this to my todo list.",
    },
  ];

  for (const comment of commentData) {
    if (users[comment.userIndex].role !== "ADMIN") {
      await prisma.comment.create({
        data: {
          description: comment.text,
          authorId: users[comment.userIndex].id,
          ideaId: createdIdeas[comment.ideaIndex].id,
        },
      });
    }
  }

  // DETERMINISTIC USER IDEA STATUSES
  const statusData = [
    { userIndex: 0, ideaIndex: 1, status: "TODO" },
    { userIndex: 0, ideaIndex: 2, status: "IN_PROGRESS" },
    { userIndex: 0, ideaIndex: 3, status: "COMPLETED" },
    { userIndex: 0, ideaIndex: 4, status: "FAVORITED" },

    { userIndex: 2, ideaIndex: 0, status: "FAVORITED" },
    { userIndex: 2, ideaIndex: 5, status: "TODO" },
    { userIndex: 2, ideaIndex: 6, status: "IN_PROGRESS" },

    { userIndex: 3, ideaIndex: 1, status: "COMPLETED" },
    { userIndex: 3, ideaIndex: 7, status: "TODO" },
  ];

  for (const status of statusData) {
    if (users[status.userIndex].role !== "ADMIN") {
      await prisma.userIdeaStatus.create({
        data: {
          ideaStatus: status.status,
          userId: users[status.userIndex].id,
          ideaId: createdIdeas[status.ideaIndex].id,
        },
      });
    }
  }

  // Update average ratings for ideas (deterministic)
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
          averageRating: Math.round(averageRating * 100) / 100,
          completionCount: reviews.length * 2, // Deterministic completion count
        },
      });
    }
  }

  // DETERMINISTIC FOLLOW RELATIONSHIPS
  const followData = [
    // DemoUser follows others
    { followerIndex: 0, followingIndex: 2 }, // DemoUser -> PublicUser1
    { followerIndex: 0, followingIndex: 4 }, // DemoUser -> PublicUser2
    { followerIndex: 0, followingIndex: 6 }, // DemoUser -> TestUser1

    // PublicUser1 follows others
    { followerIndex: 2, followingIndex: 0 }, // PublicUser1 -> DemoUser
    { followerIndex: 2, followingIndex: 3 }, // PublicUser1 -> PrivateUser1
    { followerIndex: 2, followingIndex: 7 }, // PublicUser1 -> TestUser2

    // PrivateUser1 follows others
    { followerIndex: 3, followingIndex: 2 }, // PrivateUser1 -> PublicUser1
    { followerIndex: 3, followingIndex: 4 }, // PrivateUser1 -> PublicUser2

    // TestUsers follow each other
    { followerIndex: 6, followingIndex: 7 }, // TestUser1 -> TestUser2
    { followerIndex: 7, followingIndex: 8 }, // TestUser2 -> TestUser3
    { followerIndex: 8, followingIndex: 9 }, // TestUser3 -> TestUser4
  ];

  for (const follow of followData) {
    await prisma.userFollow.create({
      data: {
        followerId: users[follow.followerIndex].id,
        followingId: users[follow.followingIndex].id,
      },
    });
  }

  // DETERMINISTIC FOLLOW REQUESTS
  const followRequestData = [
    // Pending requests
    { fromIndex: 4, toIndex: 3, status: "PENDING" }, // PublicUser2 -> PrivateUser1
    { fromIndex: 5, toIndex: 0, status: "PENDING" }, // PrivateUser2 -> DemoUser
    { fromIndex: 9, toIndex: 2, status: "PENDING" }, // TestUser4 -> PublicUser1
    { fromIndex: 10, toIndex: 3, status: "PENDING" }, // TestUser5 -> PrivateUser1

    // Accepted requests (with corresponding follows already created)
    { fromIndex: 0, toIndex: 2, status: "ACCEPTED" }, // DemoUser -> PublicUser1
    { fromIndex: 2, toIndex: 3, status: "ACCEPTED" }, // PublicUser1 -> PrivateUser1

    // Rejected requests
    { fromIndex: 11, toIndex: 5, status: "REJECTED" }, // TestUser6 -> PrivateUser2
    { fromIndex: 12, toIndex: 3, status: "REJECTED" }, // TestUser7 -> PrivateUser1
  ];

  for (const request of followRequestData) {
    // Create dates based on status
    let createdAt = new Date();
    if (request.status === "ACCEPTED") {
      createdAt = new Date("2024-01-15T10:00:00Z"); // 15 days ago
    } else if (request.status === "REJECTED") {
      createdAt = new Date("2024-01-10T15:30:00Z"); // 20 days ago
    } else {
      createdAt = new Date("2024-01-25T12:00:00Z"); // 5 days ago
    }

    await prisma.followRequest.create({
      data: {
        fromUserId: users[request.fromIndex].id,
        toUserId: users[request.toIndex].id,
        status: request.status,
        createdAt: createdAt,
      },
    });
  }

  const regularUsers = users.filter((u) => u.role === "USER");
  const followRelationships = followData.length;
  const followRequests = followRequestData.length;
  const pendingRequests = followRequestData.filter(
    (r) => r.status === "PENDING",
  ).length;
  const acceptedRequests = followRequestData.filter(
    (r) => r.status === "ACCEPTED",
  ).length;
  const rejectedRequests = followRequestData.filter(
    (r) => r.status === "REJECTED",
  ).length;

  console.log("🌱 Database seeded successfully with DETERMINISTIC data!");
  console.log(`Created:`);
  console.log(`- ${users.length} users (${regularUsers.length} regular users)`);
  console.log(`- ${createdIdeas.length} ideas`);
  console.log(`- ${reviewData.length} reviews`);
  console.log(`- ${commentData.length} comments`);
  console.log(`- ${statusData.length} user idea statuses`);
  console.log(`- ${followRelationships} follow relationships`);
  console.log(`- ${followRequests} follow requests`);
  console.log(`  - ${pendingRequests} pending`);
  console.log(`  - ${acceptedRequests} accepted`);
  console.log(`  - ${rejectedRequests} rejected`);
  console.log(`\n🧪 Test users created:`);
  console.log(
    `- DemoUser (public, follows: PublicUser1, PublicUser2, TestUser1)`,
  );
  console.log(
    `- PublicUser1 (public, follows: DemoUser, PrivateUser1, TestUser2)`,
  );
  console.log(`- PrivateUser1 (private, follows: PublicUser1, PublicUser2)`);
  console.log(`- PublicUser2 (public, has pending request to PrivateUser1)`);
  console.log(`- PrivateUser2 (private, has pending request from PublicUser2)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
