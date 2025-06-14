const ideasService = require("../services/ideas.service");

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
    const ideaId = req.params.id;
    const requestingUserId = req.user.id;
    const idea = await ideasService.getIdea(ideaId, requestingUserId);

    res.status(200).json({
      success: true,
      data: idea,
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
      data: randomIdea,
    });
  } catch (error) {
    next(error);
  }
};

const getIdeaComments = async (req, res, next) => {
  try {
    const filters = req.query;
    const ideaId = req.params.id;
    const comments = await ideasService.getIdeaComments(ideaId, filters);

    res.status(200).json({
      success: true,
      data: comments,
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

module.exports = {
  getAllIdeas,
  getIdea,
  getIdeaComments,
  getRandomIdea,
  createIdea,
};
