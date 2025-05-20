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

module.exports = {
  registerUser,
  loginUser,
};
