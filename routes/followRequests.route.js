const express = require("express");
const router = express.Router();
const followRequestsController = require("../controllers/followRequests.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Send someone a request
// Receive single Object in data
router.post(
  "/:userId",
  requireAuth,
  followRequestsController.sendFollowRequest,
);

// Cancel sent request
router.delete(
  "/sent/:userId",
  requireAuth,
  followRequestsController.cancelFollowRequest,
);

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
