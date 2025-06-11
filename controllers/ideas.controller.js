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

module.exports = {
  getAllIdeas,
};
