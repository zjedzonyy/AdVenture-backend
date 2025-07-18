const commentsService = require("../services/comments.service");
const db = require("../database/queries/index");

const createComment = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const description = req.body.description;
    const ideaId = Number(req.params.ideaId);

    const comment = await db.createComment(
      requestingUserId,
      ideaId,
      description,
    );

    res.status(200).json({
      success: true,
      message: `Comment created`,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const description = req.body.description;
    const commentId = Number(req.params.commentId);

    const comment = await commentsService.updateComment(
      requestingUserId,
      commentId,
      description,
    );

    res.status(200).json({
      success: true,
      message: `Comment updated`,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const commentId = Number(req.params.commentId);

    const remove = await commentsService.deleteComment(
      commentId,
      requestingUserId,
    );

    res.status(200).json({
      success: true,
      message: `Comment updated`,
      data: remove,
    });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const filters = req.query;
    const ideaId = Number(req.params.ideaId);

    const comments = await commentsService.getComments(ideaId, filters);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const requestingUserId = req.user.id;
    const like = await commentsService.likeComment(commentId, requestingUserId);

    res.status(200).json({
      success: true,
      message: "Comment liked/unliked",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};

const unlikeComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const requestingUserId = req.user.id;

    const unlike = await commentsService.unlikeComment(
      commentId,
      requestingUserId,
    );

    res.status(200).json({
      success: true,
      message: "Comment unliked",
      data: unlike,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  updateComment,
  getComments,
  likeComment,
  unlikeComment,
  deleteComment,
};
