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

module.exports = {
  getAllIdeas,
  getIdea,
};
