const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const ideasValidation = require("../middlewares/ideas.validation");
const { idea } = require("../database/prisma");

// Add viewCount every time someone fetch Idea
// Update averageRating
// Count completionCount

router.get("/", requireAuth, ideasController.getAllIdeas); // List all ideas (supports filters via req.query)
router.get("/lucky", ideasController.getRandomIdea); // Get random idea
router.get("/:id", requireAuth, ideasController.getIdea); // Get single idea, with stats and without commments and reviews
router.get("/:id/comments", requireAuth, ideasController.getIdeaComments); // Get all comments for this Idea

// Create Idea
// Auth -> validate body data -> processing request
router.post(
  "/",
  requireAuth,
  ideasValidation.validateIdea,
  ideasController.createIdea,
);

router.put("/:id", requireAuth); // Update own idea
router.delete("/:id", requireAuth); // Delete own idea

router.patch("/:id/activate", requireAuth); // Toggle isActive

router.post("/:id/like", requireAuth); // Add to favorite
router.delete("/:id/like", requireAuth); // Remove from favorites

module.exports = router;
