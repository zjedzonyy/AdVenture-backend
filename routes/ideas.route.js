const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { idea } = require("../database/prisma");

// Add viewCount every time someone fetch Idea
// Update averageRating
// Count completionCount

router.get("/", requireAuth, ideasController.getAllIdeas); // List all ideas (with filters from query req.query)
router.get("/:id", requireAuth); // Get single idea
// router.get("/filter", requireAuth); // Search based on filters
router.get("/lucky-luke", requireAuth); // Get random idea
router.get("/popular", requireAuth); // Get most popular Ideas
router.get("/recent", requireAuth); // Most recent Ideas

router.post("/", requireAuth); // Create Idea
router.put("/:id", requireAuth); // Update own idea
router.delete("/:id", requireAuth); // Delete own idea

router.patch("/:id/activate", requireAuth); // Toggle isActive

router.post("/:id/like", requireAuth); // Add to favorite
router.delete("/:id/lke", requireAuth); // Remove from favorites

module.exports = router;
