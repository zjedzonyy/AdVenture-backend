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

const getMineProfile = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;

    const userData = await userService.getMineProfile(requestingUserId);

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

const getUsers = async (req, res, next) => {
  try {
    const username = req.query.username;

    const users = await db.getUsers(username);

    res.status(200).json({
      success: true,
      message: `Found users`,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const file = req.file;
    const requestingUserId = req.user.id;
    if (!file) {
      throw new BadRequestError("Must include file");
    }
    const url = await userService.uploadAvatar(requestingUserId, file);

    res.status(200).json({
      success: true,
      message: `Avatar uploaded`,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAvatar = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;

    await userService.deleteAvatar(requestingUserId);

    res.status(200).json({
      success: true,
      message: `Avatar deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getFollowRequests,
  getSentFollowRequests,
  getMineProfile,
  getUsers,
  uploadAvatar,
  deleteAvatar,
};
