const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const multer = require("multer");

//File storage config
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users based on filters
 *     description: Fetches users based on provided filters.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter users by username.
 *     responses:
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "UnauthorizedError"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       200:
 *         description: Successfully fetched users
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
 *                   example: "Found users"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "5262ad5b-149a-4aa5-9431-2b7208e496dd"
 *                       username:
 *                         type: string
 *                         example: "TestUser10"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-15T15:11:21.427Z"
 *                       profileViewCount:
 *                         type: integer
 *                         example: 0
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: "USER"
 *                       followersCount:
 *                         type: integer
 *                         example: 2
 *                       followingsCount:
 *                         type: integer
 *                         example: 1

 */
router.get("/", requireAuth, userController.getUsers); // Get users based on filters

router.get("/me", requireAuth, userController.getMineProfile);
// Case 1: User requests their own data → receives all data
// Case 2: User requests data of someone they follow → receives public data
// Case 3: User requests data of someone they don't follow → receives only basic data
router.get("/:id", requireAuth, userController.getUserProfile);

// Get received requests
// data as Array of Objects
router.get(
  "/me/follow-requests",
  requireAuth,
  userController.getFollowRequests,
);

// Sent requests
router.get(
  "/me/sent-follow-requests",
  requireAuth,
  userController.getSentFollowRequests,
);

// Upload/update avatar
router.post(
  "/avatars",
  requireAuth,
  upload.single("file"),
  userController.uploadAvatar,
);

// Delete avatar
router.delete("/avatars", requireAuth, userController.deleteAvatar);

module.exports = router;
