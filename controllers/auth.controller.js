const bcrypt = require("bcryptjs");
const db = require("../database/queries");
const userService = require("../services/user.service");

async function registerUser(req, res, next) {
  try {
    const { username, password, email } = req.body;

    const newUser = await userService.register({ username, password, email });

    // Add automatic login?

    res.status(201).json("User created successfully!");
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
