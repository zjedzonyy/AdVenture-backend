const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

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

module.exports = router;
