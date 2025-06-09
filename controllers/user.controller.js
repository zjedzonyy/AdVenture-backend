// controllers/user.controllers.js
const { request } = require("../app");
const userService = require("../services/user.service");

const getUserProfile = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const targetUsername = req.params.username;

    const userData = await userService.getUserProfile(
      requestingUserId,
      targetUsername,
    );

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }

  //     // My own profile -> all data
  //     if (requestingUser === targetUser.username) {
  //       userData = requestingUserData;
  //     }
  //     // Sciagnij user id pytajacego i o kogo sie pyta
  //     const targetUserId =
  //     let followingUsernames = await userService.isFollowing(requestingUserData.id, )

  // };
};
module.exports = {
  getUserProfile,
};
