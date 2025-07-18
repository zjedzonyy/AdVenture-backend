const express = require("express");
const router = express.Router();
const followsController = require("../controllers/follows.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Stop following someone
router.delete("/:id/unfollow", requireAuth, followsController.unfollowUser);

// Remove follower
router.delete("/:userId/remove", requireAuth, followsController.removeFollower);

/**
 * @swagger
 * /follows/{userId}/followers:
 *   get:
 *     summary: Get followers of a user
 *     description: Fetch the list of followers for a specific user.
 *     tags:
 *       - Follows
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           example: "807ed6c6-5129-417e-a11a-aac39ce78055"
 *         required: true
 *         description: ID of the user whose followers to fetch
 *     responses:
 *       403:
 *         description: Forbidden access
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
 *                   example: "You must follow the User to see her details"
 *       200:
 *         description: Fetched followers successfully
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
 *                   example: "Fetched your followers"
 *                 data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                          example: 1
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2023-10-01T12:00:00Z"
 *                        followerId:
 *                          type: uuid
 *                          example: "807ed6c6-5129-417e-a11a-a11a-aac39ce78055"
 *                        followerUsername:
 *                          type: string
 *                          example: "john_doe"
 *                        avatarUrl:
 *                          type: string
 *                          example: "https://example.com/avatar.jpg"
 */
router.get("/:userId/followers", requireAuth, followsController.getFollowers); // Get followers

// Get followings
router.get("/:userId/followings", requireAuth, followsController.getFollowings);

//  Check if user is following another user
router.get(
  "/is-following/:targetId",
  requireAuth,
  followsController.isFollowing,
);

module.exports = router;
