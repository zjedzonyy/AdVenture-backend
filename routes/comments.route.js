const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const ideasValidation = require("../middlewares/ideas.validation");

router.get("/:ideaId", requireAuth, commentsController.getComments); // Get all comments for this Idea

// Create comment for this Idea
router.post(
  "/:ideaId",
  requireAuth,
  ideasValidation.validateComment,
  commentsController.createComment,
);

// Update a comment
router.patch(
  "/:commentId",
  requireAuth,
  ideasValidation.validateComment,
  commentsController.updateComment,
);

// Delete a comment
router.delete("/:commentId", requireAuth, commentsController.deleteComment);

// Like a comment
router.post("/:commentId/like", requireAuth, commentsController.likeComment);

//Unlike a comment
router.delete(
  "/:commentId/like",
  requireAuth,
  commentsController.unlikeComment,
);

module.exports = router;
