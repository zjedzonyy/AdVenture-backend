const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const ideasValidation = require("../middlewares/ideas.validation");

router.get("/", requireAuth, ideasController.getAllIdeas); // List all ideas (supports filters via req.query)
router.get("/filters", requireAuth, ideasController.getFilters); // Get filters (doesn't include enums)
router.get("/lucky", ideasController.getRandomIdea); // Get random idea
router.get("/popular", ideasController.getPopularIdeas);
router.get("/:id", requireAuth, ideasController.getIdea); // Get single idea, with stats and without commments and reviews

// Create Idea
// Auth -> validate body data -> processing request
router.post(
  "/",
  requireAuth,
  ideasValidation.validateIdea,
  ideasController.createIdea,
);

// Update own idea
router.put(
  "/:id",
  requireAuth,
  ideasValidation.validateIdea,
  ideasController.updateIdea,
);

router.delete("/:id", requireAuth, ideasController.deleteIdea); // Delete own idea

router.patch("/:id/activate", requireAuth, ideasController.toggleIsActive); // Toggle isActive

// Change idea status: todo, in_progress, completed, favorited
router.post(
  "/:id/status",
  requireAuth,
  ideasValidation.validateIdeaStatus,
  ideasController.changeStatus,
);

// Get your review
router.get("/:ideaId/review", requireAuth, ideasController.getReview);

// Create review
router.post(
  "/:ideaId/review",
  requireAuth,
  ideasValidation.validateReview,
  ideasController.createReview,
);

// Get Ideas average rating
router.get(
  "/:ideaId/average-rating",
  requireAuth,
  ideasController.getAverageRating,
);

// Dodaj zmień Idea status:
module.exports = router;
