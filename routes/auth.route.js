const express = require("express");
const authController = require("../controllers/auth.controller");
const userValidation = require("../middlewares/user.validation");
const passport = require("passport");

const router = express.Router();

router.post(
  "/register",
  userValidation.validateUserRegistration,
  authController.registerUser,
);

router.post(
  "/login",
  userValidation.validateUserLogin,
  passport.authenticate("local"),
  authController.loginUser,
);

module.exports = router;
