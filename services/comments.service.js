const db = require("../database/queries/index");
const { NotFoundError, BadRequestError } = require("../utils/error.utils");

const getComments = async (ideaId, filters) => {
  const page = Math.max(1, parseInt(filters.page || 1));
  const limit = Math.min(10, Math.max(1, parseInt(filters.limit)) || 10);
  const skip = (page - 1) * limit;

  const idea = await db.getIdea(ideaId);
  if (!idea) {
    throw new BadRequestError("Idea not found");
  }

  if (filters.limit === "0") {
    const { comments, totalCount } = await db.getIdeaComments(Number(ideaId));
    return { comments, totalCount };
  }
  const { comments, totalCount } = await db.getIdeaComments(
    Number(ideaId),
    skip,
    limit,
  );

  if (!comments) {
    throw new NotFoundError("Couldn't find requested comments for this Idea");
  }

  const totalPages = Math.ceil(totalCount / limit);

  return {
    comments,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const likeComment = async (commentId, requestingUserId) => {
  const comment = await db.getComment(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }
  const liked = await db.checkIfCommentIsLiked(commentId, requestingUserId);
  if (liked) {
    throw new BadRequestError("Comment already liked");
  }

  const like = await db.likeComment(commentId, requestingUserId);

  return like;
};

const unlikeComment = async (commentId, requestingUserId) => {
  const comment = await db.getComment(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }
  const liked = await db.checkIfCommentIsLiked(commentId, requestingUserId);
  if (!liked) {
    throw new BadRequestError("Comment is not liked");
  }

  const unlike = await db.unlikeComment(commentId, requestingUserId);

  return unlike;
};

const deleteComment = async (commentId, requestingUserId) => {
  const comment = await db.getComment(commentId);
  const user = await db.getUserById(requestingUserId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  //   CHANGE FOR MIDDLEWARE THAT ASKS FOR REQUIRED PERMISSION AS PARAMETERS
  if (comment.authorId !== requestingUserId && user.role !== "ADMIN") {
    throw new BadRequestError("You must be admin or author of the comment");
  }

  const remove = await db.deleteComment(commentId, requestingUserId);

  return remove;
};

module.exports = { getComments, likeComment, unlikeComment, deleteComment };
