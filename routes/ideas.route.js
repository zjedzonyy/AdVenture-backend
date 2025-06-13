const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { idea } = require("../database/prisma");

// Add viewCount every time someone fetch Idea
// Update averageRating
// Count completionCount

router.get("/", requireAuth, ideasController.getAllIdeas); // List all ideas (supports filters via req.query)
router.get("/:id", requireAuth, ideasController.getIdea); // Get single idea, with stats and without commments and reviews
router.get("/:id/comments", requireAuth, ideasController.getIdeaComments); // Get all comments for this Idea
// router.get("/filter", requireAuth); // Search based on filters
router.get("/lucky-luke", requireAuth); // Get random idea
router.get("/popular", requireAuth); // Get most popular Ideas
router.get("/recent", requireAuth); // Most recent Ideas

router.post("/", requireAuth); // Create Idea
router.put("/:id", requireAuth); // Update own idea
router.delete("/:id", requireAuth); // Delete own idea

router.patch("/:id/activate", requireAuth); // Toggle isActive

router.post("/:id/like", requireAuth); // Add to favorite
router.delete("/:id/like", requireAuth); // Remove from favorites

module.exports = router;
