// controllers/user.controllers.js

const getUserProfile = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = req.user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
};
