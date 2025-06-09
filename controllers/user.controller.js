// controllers/user.controllers.js
const { request } = require("../app");
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
