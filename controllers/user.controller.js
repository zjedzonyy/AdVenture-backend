// controllers/user.controllers.js
const userService = require("../services/user.service");
const db = require("../database/queries/index");
const { BadRequestError } = require("../utils/error.utils");

const getUserProfile = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const targetId = req.params.id;

    const userData = await userService.getUserProfile(
      requestingUserId,
      targetId,
    );

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowRequests = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;

    const requests = await db.getUsersFollowRequests(requestingUserId);

    res.status(200).json({
      success: true,
      message: `Fetched follow requests`,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

const getSentFollowRequests = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;

    const requests = await db.getUsersSentFollowRequests(requestingUserId);

    res.status(200).json({
      success: true,
      message: `Fetched sent follow requests`,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getFollowRequests,
  getSentFollowRequests,
};
