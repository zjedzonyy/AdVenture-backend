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

// If to slow -> add Index on comments.ideaId
async function getIdeaComments(ideaId, skip, limit) {
  const comments = await prisma.comment.findMany({
    where: {
      ideaId: ideaId,
    },
    select: {
      id: true,
      author: {
        select: {
          username: true,
          createdAt: true,
          reviews: {
            where: {
              ideaId: ideaId,
            },
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              follower: true,
              following: true,
            },
          },
        },
      },
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
    skip: skip,
    take: limit,
  });

  const totalCount = await prisma.comment.count({
    where: { ideaId: ideaId },
  });

  return {
    comments: comments.map(({ author, ...rest }) => ({
      ...rest,
      author: {
        ...author,
        followerCount: author._count.follower,
        followingCount: author._count.following,
        userIdeaRating: author.reviews[0].rating,
        _count: undefined,
        reviews: undefined,
      },
    })),
    totalCount,
  };
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

const deleteIdea = async (ideaId) => {
  await prisma.idea.delete({ where: { id: ideaId } });
};

// const cleanupUser = async (id) => {
//   await prisma.user.deleteMany({ where: { authorId: id } });
//   await prisma.review.deleteMany({ where: { author: id } });
//   await prisma.userIdeaStatus.deleteMany({ where: { id } });
//   await prisma.idea.deleteMany({ where: { authorId: id } });
//   await prisma.followRequest.deleteMany({
//     where: { OR: [{ fromUserId: id }, { toUserId: id }] },
//   });
//   await prisma.userFollow.deleteMany
// };

module.exports = {
  getIdea,
  getAllIdeas,
  getIdeaComments,
  incrementIdeaViewCount,
  createIdea,
  deleteIdea,
};
