const express = require("express");
const authController = require("../controllers/auth.controller");
const userValidation = require("../middlewares/user.validation");

const router = express.Router();

router.post(
  "/register",
  userValidation.validateUserRegistration,
  authController.registerUser
);

module.exports = router;
