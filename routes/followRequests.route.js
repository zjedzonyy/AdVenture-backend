const express = require("express");
const router = express.Router();
const followRequestsController = require("../controllers/followRequests.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /follow-requests/{userId}:
 *   post:
 *     summary: Send a follow request to a user
 *     description: Send a follow request to a specific user.
 *     tags:
 *       - Follow Requests
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           example: "7d7d43f7-d0a9-47da-a17e-d2b8b6a2fd13"
 *         required: true
 *         description: ID of the user to send a follow request to
 *     responses:
 *       400:
 *         description: Bad request
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
 *                   example: "Follow request already sent"
 *       200:
 *         description: Request successfully created
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
 *                   example: "Request successfully created, status: PENDING"
 *                 data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      fromUserId:
 *                       type: uuid
 *                       example: "7d7d43f7-d0a9-47da-a17e-d2b8b6a2fd13"
 *                      toUserId:
 *                       type: uuid
 *                       example: "807ed6c6-5129-417e-a11a-aac39ce78055"
 *                      status:
 *                       type: string
 *                       example: "PENDING"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-10-01T12:00:00Z"
 */
router.post(
  "/:userId",
  requireAuth,
  followRequestsController.sendFollowRequest,
); // Send someone a request. Receive single Object in data

/**
 * @swagger
 * /follow-requests/sent/{userId}:
 *   delete:
 *     summary: Cancel a follow request
 *     description: Cancel a follow request that was sent to a user.
 *     tags:
 *       - Follow Requests
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           example: "7d7d43f7-d0a9-47da-a17e-d2b8b6a2fd13"
 *         required: true
 *         description: ID of the user whose follow request you want to cancel
 *     responses:
 *       200:
 *         description: Request successfully deleted
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
 *                   example: "Request successfully deleted"
 */
router.delete(
  "/sent/:userId",
  requireAuth,
  followRequestsController.cancelFollowRequest,
); // Cancel sent request

// Accept received request
router.patch(
  "/:requestId/accept",
  requireAuth,
  followRequestsController.acceptRequest,
);

// Cancel received request
router.patch(
  "/:requestId/reject",
  requireAuth,
  followRequestsController.rejectRequest,
);

module.exports = router;
