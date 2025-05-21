// controllers/user.controllers.js

const getUserProfile = async (req, res, next) => {
  try {
    const { password, ...safeUser } = req.user;

    res.status(200).json({
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
};
