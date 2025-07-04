const followsService = require("../services/follows.service");
const db = require("../database/queries/index");
const { BadRequestError } = require("../utils/error.utils");

const unfollowUser = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const targetId = req.params.id;

    await followsService.unfollowUser(requestingUserId, targetId);
    res.status(200).json({
      success: true,
      message: `You have unfollowed user`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const removeFollower = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const targetId = req.params.userId;

    await followsService.removeFollower(requestingUserId, targetId);

    res.status(200).json({
      success: true,
      message: `User is not following you anymore`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { unfollowUser, removeFollower };
