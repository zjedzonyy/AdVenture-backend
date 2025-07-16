const prisma = require("../prisma");

async function getAllIdeas(where, orderBy, skip, limit) {
  const ideas = await prisma.idea.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy,
    skip: skip,
    take: limit,
  });

  const totalCount = await prisma.idea.count({ where });

  // Get average rating for each idea
  const averageRatings = await prisma.review.groupBy({
    by: ["ideaId"],
    _avg: {
      rating: true,
    },
    where: {
      ideaId: {
        in: ideas.map((idea) => idea.id),
      },
    },
  });

  return [
    ideas.map((idea) => ({
      ...idea,
      authorId: idea.author.id,
      authorUsername: idea.author.username,
      authorAvatarUrl: idea.author.avatarUrl,
      averageRating:
        Math.round(
          averageRatings.find((r) => r.ideaId === idea.id)?._avg.rating * 100 ||
            0 * 100,
        ) / 100,
      author: undefined,
    })),
    totalCount,
  ];
}

async function getIdea(ideaId, requestingUserId = null) {
  const idea = await prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    select: {
      id: true,
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      title: true,
      description: true,
      detailedDescription: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      viewCount: true,
      completionCount: true,
      isChallenge: true,
      duration: {
        select: {
          id: true,
          label: true,
          min: true,
          max: true,
        },
      },
      categoryLinks: {
        select: {
          category: {
            select: {
              id: true,
              label: true,
            },
          },
        },
      },
      groupSizeLinks: {
        select: {
          groupSize: {
            select: {
              id: true,
              label: true,
              min: true,
              max: true,
            },
          },
        },
      },
      priceRange: {
        select: {
          id: true,
          label: true,
          min: true,
          max: true,
        },
      },
      locationType: true,
      _count: {
        select: {
          comments: true,
          reviews: true,
        },
      },
      status: true,
      ...(requestingUserId && {
        status: {
          where: { userId: requestingUserId },
          select: { ideaStatus: true },
        },
      }),
    },
  });

  if (!idea) return null;

  const averageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { ideaId: idea.id },
  });

  return {
    ...idea,
    categories: idea.categoryLinks.map((link) => link.category),
    groupSizes: idea.groupSizeLinks.map((link) => link.groupSize),
    stats: {
      viewCount: idea.viewCount,
      averageRating: averageRating._avg.rating || 0,
      completionCount: idea.completionCount,
      commentsCount: idea._count.comments,
      reviewsCount: idea._count.reviews,
    },
    userStatus: idea.status?.[0]?.ideaStatus || null,
    categoryLinks: undefined,
    groupSizeLinks: undefined,
    _count: undefined,
    status: undefined,
  };
}

async function getAverageRating(ideaId) {
  const averageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { ideaId: ideaId },
  });

  return averageRating._avg.rating;
}

async function incrementIdeaViewCount(ideaId) {
  return prisma.idea.update({
    where: { id: ideaId },
    data: { viewCount: { increment: 1 } },
  });
}

async function createIdea(
  title,
  description,
  detailedDescription,
  isActive,
  isChallenge,
  durationId,
  categories,
  groups,
  priceRangeId,
  locationType,
  authorId,
) {
  const idea = await prisma.idea.create({
    data: {
      authorId,
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      priceRangeId,
      locationType,
      categoryLinks: {
        create: categories.map((categoryId) => ({
          categoryId: categoryId,
        })),
      },
      groupSizeLinks: {
        create: groups.map((groupSizeId) => ({
          groupSizeId: groupSizeId,
        })),
      },
    },
  });

  return idea.id;
}

async function updateIdea(
  title,
  description,
  detailedDescription,
  isActive,
  isChallenge,
  durationId,
  categories,
  groups,
  priceRangeId,
  locationType,
  authorId,
  ideaId,
) {
  const idea = await prisma.idea.update({
    where: {
      id: ideaId,
      authorId: authorId,
    },
    data: {
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      priceRangeId,
      locationType,

      // Delete relations then update
      categoryLinks: {
        deleteMany: {}, // Delete all relations
        create:
          categories.map((categoryId) => ({
            categoryId: categoryId,
          })) || [],
      },
      groupSizeLinks: {
        deleteMany: {},
        create:
          groups.map((groupSizeId) => ({
            groupSizeId: groupSizeId,
          })) || [],
      },
    },
  });

  return idea.id;
}

const deleteIdea = async (ideaId) => {
  await prisma.idea.delete({ where: { id: ideaId } });
};

const toggleIsActive = async (ideaId) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

  await prisma.idea.update({
    where: { id: ideaId },
    data: { isActive: !idea.isActive },
  });
};

const changeStatus = async (ideaId, requestingUserId, ideaStatus) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new Error("Idea not found");
  }

  const userIdeaStatus = await prisma.userIdeaStatus.upsert({
    where: {
      userId_ideaId: {
        userId: requestingUserId,
        ideaId: ideaId,
      },
    },
    // If the record exists:
    update: {
      ideaStatus: ideaStatus,
    },
    // If it doesn't exist
    create: {
      userId: requestingUserId,
      ideaId: ideaId,
      ideaStatus: ideaStatus,
    },
  });

  return userIdeaStatus.ideaStatus;
};

async function createReview(requestingUserId, rating, ideaId) {
  const review = await prisma.review.upsert({
    where: {
      authorId_ideaId: {
        ideaId,
        authorId: requestingUserId,
      },
    },
    update: {
      rating,
    },
    create: {
      rating,
      ideaId,
      authorId: requestingUserId,
    },
  });

  return review;
}

async function getReview(requestingUserId, ideaId) {
  const review = await prisma.review.findUnique({
    where: {
      authorId_ideaId: {
        ideaId,
        authorId: requestingUserId,
      },
    },
  });
  if (!review) {
    return "You didn't rate yet";
  }

  return review;
}

async function getFilters() {
  // price-ranges
  const priceRanges = await prisma.priceRange.findMany({
    select: {
      id: true,
      label: true,
    },
  });

  const durations = await prisma.duration.findMany({
    select: {
      id: true,
      label: true,
    },
  });

  const groups = await prisma.groupSize.findMany({
    select: {
      id: true,
      label: true,
    },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      label: true,
    },
  });

  return { priceRanges, durations, groups, categories };
}

async function getPopularIdeas() {
  const ideas = await prisma.idea.findMany({
    select: {
      id: true,
      author: {
        select: {
          username: true,
          id: true,
          avatarUrl: true,
        },
      },
      title: true,
      description: true,
      createdAt: true,
      isActive: true,
      viewCount: true,
      averageRating: true,
      completionCount: true,
      isChallenge: true,
      durationId: true,
      priceRangeId: true,
      locationType: true,
    },
    orderBy: { viewCount: "desc" },
    take: 6,
  });

  return [
    ...ideas.map((idea) => ({
      ...idea,
      authorId: idea.author.id,
      authorUsername: idea.author.username,
      authorAvatarUrl: idea.author.avatarUrl,
      author: undefined,
    })),
  ];
}

module.exports = {
  getIdea,
  getAllIdeas,
  incrementIdeaViewCount,
  createIdea,
  deleteIdea,
  updateIdea,
  toggleIsActive,
  changeStatus,
  createReview,
  getReview,
  getFilters,
  getPopularIdeas,
  getAverageRating,
};
