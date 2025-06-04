// const bcrypt = require("bcryptjs");
// const db = require("../database/queries");
const userService = require("../services/user.service");

async function registerUser(req, res, next) {
  try {
    const { username, password, email } = req.body;
    const newUser = await userService.register({ username, password, email });

    if (process.env.NODE_ENV !== "test") {
      req.login({ id: newUser }, (err) => {
        if (err) return next(err);
        res.status(201).json({
          message: "User registered and logged in successfully!",
          user: newUser.username,
        });
      });
    } else {
      res.status(201).json({
        message: "User registered and logged in successfully!",
        user: newUser.username,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res) {
  res.json({ message: "Logged in successfully", user: req.user.username });
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
}

module.exports = {
  registerUser,
  loginUser,
  logout,
};
