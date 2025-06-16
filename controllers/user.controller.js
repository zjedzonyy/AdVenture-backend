// controllers/user.controllers.js
const userService = require("../services/user.service");

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
module.exports = {
  getUserProfile,
};
