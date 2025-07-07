const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const multer = require("multer");

//File storage config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get users based on fitlers
router.get("/", requireAuth, userController.getUsers);

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
