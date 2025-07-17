const express = require("express");
const router = express.Router();
const ideasController = require("../controllers/ideas.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const ideasValidation = require("../middlewares/ideas.validation");

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Get all ideas
 *     tags:
 *       - Ideas
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, max 10)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular, least_popular, rating, least_rating, completed, least_completed]
 *         description: Sort by field
 *       - in: query
 *         name: authorUsername
 *         schema:
 *           type: string
 *         description: Filter by author's username
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by description
 *       - in: query
 *         name: created_at
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by creation date (YYYY-MM-DD)
 *       - in: query
 *         name: created_after
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by creation date after (YYYY-MM-DD)
 *       - in: query
 *         name: created_before
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by creation date before (YYYY-MM-DD)
 *       - in: query
 *         name: updated_at
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by last updated date (YYYY-MM-DD)
 *       - in: query
 *         name: updated_after
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by last updated date after (YYYY-MM-DD)
 *       - in: query
 *         name: updated_before
 *         schema:
 *           type: string
 *         format: date
 *         description: Filter by last updated date before (YYYY-MM-DD)
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status ("true" or "false" as string)
 *       - in: query
 *         name: view_count
 *         schema:
 *           type: string
 *         description: Filter by view count (as string, will be converted to number)
 *       - in: query
 *         name: view_count_max
 *         schema:
 *           type: string
 *         description: Filter by maximum view count (as string, will be converted to number)
 *       - in: query
 *         name: view_count_min
 *         schema:
 *           type: string
 *         description: Filter by minimum view count (as string, will be converted to number)
 *       - in: query
 *         name: avg_rating
 *         schema:
 *           type: string
 *         description: Filter by exact average rating (as string, e.g. "4.3")
 *       - in: query
 *         name: avg_rating_min
 *         schema:
 *           type: string
 *         description: Minimum average rating (as string)
 *       - in: query
 *         name: avg_rating_max
 *         schema:
 *           type: string
 *         description: Maximum average rating (as string)
 *       - in: query
 *         name: completion
 *         schema:
 *           type: string
 *         description: Filter by exact completion count (as string)
 *       - in: query
 *         name: completion_min
 *         schema:
 *           type: string
 *         description: Minimum completion count (as string)
 *       - in: query
 *         name: completion_max
 *         schema:
 *           type: string
 *         description: Maximum completion count (as string)
 *       - in: query
 *         name: challenge
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Whether the idea is a challenge (as string)
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: Duration ID (as string, 1 = "0-15", ..., 7 = "Weekend")
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs (e.g. "1,2,3")
 *       - in: query
 *         name: groupIds
 *         schema:
 *           type: string
 *         description: Comma-separated group size IDs (e.g. "1,2,3")
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *         description: Price range ID (as string)
 *       - in: query
 *         name: location_type
 *         schema:
 *           type: string
 *           enum: [INDOOR, OUTDOOR, HYBRID, FLEXIBLE]
 *         description: Location type
 *       - in: query
 *         name: comments
 *         schema:
 *           type: string
 *           enum: [true]
 *         description: Return only ideas the user commented on
 *       - in: query
 *         name: reviews
 *         schema:
 *           type: string
 *           enum: [true]
 *         description: Return only ideas the user reviewed
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, COMPLETED, FAVORITED]
 *         description: Filter ideas by user status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Set to "0" to fetch all records
 *     responses:
 *       400:
 *        description: Bad request, invalid query parameters
 *        content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "BadRequestError"
 *                message:
 *                  type: string
 *                  example: "Invalid query parameters"
 *       200:
 *         description: Successfully fetched ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ideas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 42
 *                           authorId:
 *                             type: string
 *                             example: "377dc41e-4864-4c54-8135-2b2b0fc8318f"
 *                           title:
 *                             type: string
 *                             example: "Weekend Adventure Project #42"
 *                           description:
 *                             type: string
 *                             example: "Perfect for beginners and experienced participants alike."
 *                           detailedDescription:
 *                             type: string
 *                             example: "Perfect for beginners and experienced participants alike. Join this exciting challenge!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T15:11:21.550Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-15T15:11:21.767Z"
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                           viewCount:
 *                             type: integer
 *                             example: 77
 *                           averageRating:
 *                             type: number
 *                             example: 2.5
 *                           completionCount:
 *                             type: integer
 *                             example: 4
 *                           isChallenge:
 *                             type: boolean
 *                             example: false
 *                           durationId:
 *                             type: integer
 *                             example: 7
 *                           priceRangeId:
 *                             type: integer
 *                             example: 2
 *                           locationType:
 *                             type: string
 *                             enum: [INDOOR, OUTDOOR, HYBRID, FLEXIBLE]
 *                             example: "OUTDOOR"
 *                           authorUsername:
 *                             type: string
 *                             example: "TestUser9"
 *                           authorAvatarUrl:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           author:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "377dc41e-4864-4c54-8135-2b2b0fc8318f"
 *                               username:
 *                                 type: string
 *                                 example: "TestUser9"
 *                               avatarUrl:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalItems:
 *                           type: integer
 *                           example: 47
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPreviousPage:
 *                           type: boolean
 *                           example: false
 */
router.get("/", requireAuth, ideasController.getAllIdeas);

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

/**
 * @swagger
 * /ideas/{ideaId}/average-rating:
 *   get:
 *     summary: Get ideas average rating
 *     description: Fetches the average rating of a specific idea.
 *     tags:
 *       - Ideas
 *     parameters:
 *       - in: path
 *         name: ideaId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the idea to fetch the average rating for.
 *     responses:
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "UnauthorizedError"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       200:
 *         description: Successfully fetched average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: number
 *                   description: The average rating of the idea
 *                   example: 4.67
 */
router.get(
  "/:ideaId/average-rating",
  requireAuth,
  ideasController.getAverageRating,
); // Get Ideas average rating

// Dodaj zmień Idea status:
module.exports = router;
