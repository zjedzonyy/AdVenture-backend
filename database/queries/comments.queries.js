const prisma = require("../prisma");

// If to slow -> add Index on comments.ideaId
async function getIdeaComments(ideaId, skip, limit) {
  const comments = await prisma.comment.findMany({
    where: {
      ideaId: ideaId,
    },
    select: {
      id: true,
      _count: {
        select: {
          likedComment: true,
        },
      },
      author: {
        select: {
          username: true,
          createdAt: true,
          avatarUrl: true,
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
      commentLikes: rest._count.likedComment,
      author: {
        ...author,
        followerCount: author._count.follower,
        followingCount: author._count.following,
        userIdeaRating: author.reviews[0]?.rating,
        _count: undefined,
        reviews: undefined,
      },
      _count: undefined,
    })),
    totalCount,
  };
}

async function checkIfCommentIsLiked(commentId, requestingUserId) {
  const liked = await prisma.likedComments.findUnique({
    where: {
      userId_commentId: {
        userId: requestingUserId,
        commentId: commentId,
      },
    },
  });

  return liked;
}

async function deleteComment(commentId) {
  const remove = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return remove;
}

async function unlikeComment(commentId, requestingUserId) {
  const like = await prisma.likedComments.delete({
    where: {
      userId_commentId: {
        userId: requestingUserId,
        commentId: commentId,
      },
    },
  });

  const likesCount = await prisma.likedComments.count({
    where: {
      commentId: commentId,
    },
  });

  return { ...like, likesCount };
}

async function createComment(userId, ideaId, description) {
  const comment = await prisma.comment.create({
    data: {
      authorId: userId,
      ideaId,
      description,
    },
    select: {
      id: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likedComment: true,
        },
      },
      author: {
        select: {
          username: true,
          avatarUrl: true,
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
    },
  });

  return {
    ...comment,
    commentLikes: comment._count.likedComment,
    author: {
      ...comment.author,
      followerCount: comment.author._count.follower,
      followingCount: comment.author._count.following,
      userIdeaRating: comment.author.reviews[0]?.rating,

      _count: undefined,
      reviews: undefined,
    },
    _count: undefined,
  };
}

async function updateComment(userId, commentId, description) {
  const comment = await prisma.comment.update({
    where: {
      authorId: userId,
      id: commentId,
    },
    data: { description },
  });

  return comment;
}

async function getComment(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  return comment;
}

async function likeComment(commentId, requestingUserId) {
  const like = await prisma.likedComments.create({
    data: {
      userId: requestingUserId,
      commentId: commentId,
    },
  });

  const likesCount = await prisma.likedComments.count({
    where: {
      commentId: commentId,
    },
  });

  return { ...like, likesCount };
}

module.exports = {
  getIdeaComments,
  checkIfCommentIsLiked,
  deleteComment,
  unlikeComment,
  createComment,
  updateComment,
  getComment,
  likeComment,
};
