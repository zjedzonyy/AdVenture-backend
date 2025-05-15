const express = require("express");
const authController = require("../controllers/authController");
const userValidation = require("../middlewares/userValidation");

const router = express.Router();

router.post(
  "/register",
  userValidation.validateUserRegistration,
  authController.registerUser
);

module.exports = router;
