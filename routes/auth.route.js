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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login (demo credentials below)
 *     description: |
 *       Use demo credentials:
 *       - username: TestUser2
 *       - password: Password1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: TestUser2
 *               password:
 *                 type: string
 *                 example: Password1
 */
router.post(
  "/login",
  userValidation.validateUserLogin,
  passport.authenticate("local"),
  authController.loginUser,
);

router.post("/logout", authController.logout);

module.exports = router;
