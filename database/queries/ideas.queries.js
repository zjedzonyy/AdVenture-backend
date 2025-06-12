const prisma = require("../prisma");

async function getAllIdeas(where, orderBy, skip, limit) {
  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    skip: skip,
    take: limit,
  });

  const totalCount = await prisma.idea.count({ where });

  return [ideas, totalCount];
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
          username: true,
        },
      },
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      viewCount: true,
      averageRating: true,
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

  return {
    ...idea,
    categories: idea.categoryLinks.map((link) => link.category),
    groupSizes: idea.groupSizeLinks.map((link) => link.groupSize),
    stats: {
      viewCount: idea.viewCount,
      averageRating: idea.averageRating,
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

module.exports = {
  getIdea,
  getAllIdeas,
};
