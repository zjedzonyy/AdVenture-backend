const express = require("express");
const router = express.Router();
const followsController = require("../controllers/follows.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Stop following someone
router.delete("/:id/unfollow", requireAuth, followsController.unfollowUser);

// Remove follower
router.delete("/:userId/remove", requireAuth, followsController.removeFollower);

// Get followers
router.get("/:userId/followers", requireAuth, followsController.getFollowers);

// Get followings
router.get("/:userId/followings", requireAuth, followsController.getFollowings);

//  Check if user is following another user
router.get(
  "/is-following/:targetId",
  requireAuth,
  followsController.isFollowing,
);

module.exports = router;
