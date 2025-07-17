const ideasService = require("../services/ideas.service");
const { BadRequestError, UnauthorizedError } = require("../utils/error.utils");
const db = require("../database/queries/index");

const getAllIdeas = async (req, res, next) => {
  try {
    const filters = req.query;
    const requestingUserId = req.user.id;

    const ideas = await ideasService.getAllIdeas(filters, requestingUserId);

    res.status(200).json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    next(error);
  }
};

const getIdea = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const requestingUserId = req.user.id;

    const idea = await ideasService.getIdea(ideaId, requestingUserId);

    if (!idea) {
      throw new BadRequestError("Couldn't find requested Idea");
    }

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    next(error);
  }
};

const getAverageRating = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.ideaId);
    const averageRating = await db.getAverageRating(ideaId);

    res.status(200).json({
      success: true,
      data: averageRating,
    });
  } catch (error) {
    next(error);
  }
};

const getRandomIdea = async (req, res, next) => {
  try {
    const randomIdea = await ideasService.getRandomIdea();

    res.status(200).json({
      success: true,
      data: randomIdea.id,
    });
  } catch (error) {
    next(error);
  }
};

const createIdea = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const {
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      categories,
      groups,
      priceRangeId,
      locationType,
    } = req.body;

    const ideaId = await ideasService.createIdea(
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      categories,
      groups,
      priceRangeId,
      locationType,
      authorId,
    );

    res.status(200).json({
      success: true,
      message: "Idea has been successfully created!",
      ideaId,
    });
  } catch (error) {
    next(error);
  }
};

const updateIdea = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const requestingUserId = req.user.id;
    // Is user an author of this Idea?
    const isAuthor = await ideasService.isAuthor(ideaId, requestingUserId);
    if (!isAuthor) {
      throw new UnauthorizedError("You're not the author of this Idea");
    }

    const authorId = requestingUserId;

    const {
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      categories,
      groups,
      priceRangeId,
      locationType,
    } = req.body;

    await db.updateIdea(
      title,
      description,
      detailedDescription,
      isActive,
      isChallenge,
      durationId,
      categories,
      groups,
      priceRangeId,
      locationType,
      authorId,
      ideaId,
    );

    res.status(200).json({
      success: true,
      message: "Idea has been successfully updated!",
      ideaId,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIdea = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const ideaId = Number(req.params.id);
    const isAuthor = await ideasService.isAuthor(ideaId, requestingUserId);

    if (!isAuthor) {
      throw new UnauthorizedError("You're not the author of this Idea");
    }

    await db.deleteIdea(ideaId);

    res.status(200).json({
      success: true,
      message: "Idea has been successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

const toggleIsActive = async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const requestingUserId = req.user.id;
    const isAuthor = await ideasService.isAuthor(ideaId, requestingUserId);

    if (!isAuthor) {
      throw new UnauthorizedError("You're not the author of this Idea");
    }

    await db.toggleIsActive(ideaId);

    res.status(200).json({
      success: true,
      message: "Ideas isActive has been successfully changed!",
    });
  } catch (error) {
    next(error);
  }
};
// Expect ideaStatus to be String:
// TODO
// IN_PROGRESS
// COMPLETED
// FAVORITED
const changeStatus = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const requestingUserId = req.user.id;
    const ideaStatus = req.body.ideaStatus;

    const updatedStatus = await ideasService.changeStatus(
      ideaId,
      requestingUserId,
      ideaStatus,
    );

    res.status(200).json({
      success: true,
      message: `Ideas status has been changed to: ${updatedStatus}`,
      data: {
        ideaId,
        userId: requestingUserId,
        status: updatedStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.ideaId);
    const requestingUserId = req.user.id;
    const rating = Number(req.body.rating);

    const review = await ideasService.createReview(
      requestingUserId,
      rating,
      ideaId,
    );
    res.status(200).json({
      success: true,
      message: `Rated idea`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.ideaId);
    const requestingUserId = req.user.id;
    const review = await db.getReview(requestingUserId, ideaId);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getFilters = async (req, res, next) => {
  try {
    const filters = await db.getFilters();

    res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (error) {
    next(error);
  }
};

const getPopularIdeas = async (req, res, next) => {
  try {
    const ideas = await db.getPopularIdeas();

    res.status(200).json({
      success: true,
      data: ideas,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllIdeas,
  getIdea,
  getRandomIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleIsActive,
  changeStatus,
  createReview,
  getReview,
  getFilters,
  getPopularIdeas,
  getAverageRating,
};
