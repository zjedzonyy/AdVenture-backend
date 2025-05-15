const bcrypt = require("bcryptjs");
const db = require("../database/queries");
const userService = require("../services/userService");

async function registerUser(req, res, next) {
  try {
    const { username, password, email } = req.body;

    if (!email || !password) {
      throw new Error("Must provide email and password");
    }

    const newUser = await userService.register({ username, password, email });

    // Add automatic login?

    res.status(201).json("User created successfully!");
  } catch (error) {
    next();
  }
}

module.exports = {
  registerUser,
};
