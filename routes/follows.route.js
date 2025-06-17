const express = require("express");
const router = express.Router();
const followsController = require("../controllers/follows.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Stop following someone
router.delete("/:id/unfollow", requireAuth, followsController.unfollowUser);

// Remove follower
router.delete("/:userId/remove", requireAuth, followsController.removeFollower);

module.exports = router;
