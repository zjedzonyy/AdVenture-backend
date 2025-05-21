const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

router.get("/me", requireAuth, userController.getUserProfile);

module.exports = router;
