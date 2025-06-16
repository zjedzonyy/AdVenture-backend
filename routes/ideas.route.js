const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const ideasValidation = require("../middlewares/ideas.validation");

// Add viewCount every time someone fetch Idea

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

// Dodaj zmień Idea status:
module.exports = router;
