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

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     description: Update the content of a comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *           example: "51"
 *         required: true
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: "Updated comment content"
 *                     authorId:
 *                       type: string
 *                       format: uuid
 *                       example: "7d7d43f7-d0a9-47da-a17e-d2b8b6a2fd13"
 *                     ideaId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:00:00Z"
 *       403:
 *         description: Forbidden, you must be the author of the comment to update it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "ForbiddenError"
 *                 message:
 *                   type: string
 *                   example: "You must be the author of the comment to update it"
 */
router.patch(
  "/:commentId",
  requireAuth,
  ideasValidation.validateComment,
  commentsController.updateComment,
); // Update a comment

// Delete a comment
router.delete("/:commentId", requireAuth, commentsController.deleteComment);

/**
 * @swagger
 * /comments/{commentId}/like:
 *   post:
 *     summary: Like/unlike a comment
 *     description: Like or unlike a comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to like or unlike
 *     responses:
 *       400:
 *         description: Bad request, invalid comment ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "BadRequestError"
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
 *       200:
 *         description: Comment liked or unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment liked/unliked"
 *                 data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-10-01T12:00:00Z"
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-10-01T12:00:00Z"
 *                      userId:
 *                        type: uuid
 *                        example: "123e4567-e89b-12d3-a456-426614174000"
 *                      commentId:
 *                        type: integer
 *                        example: 1
 *                      likesCount:
 *                        type: integer
 *                        example: 10
 */
router.post("/:commentId/like", requireAuth, commentsController.likeComment); // Like/Unlike a comment

//Unlike a comment
router.delete(
  "/:commentId/like",
  requireAuth,
  commentsController.unlikeComment,
);

module.exports = router;
