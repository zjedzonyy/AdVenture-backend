const db = require("../database/queries");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/error.utils");

const register = async ({ username, password, email }) => {
  if (!username || !password || !email) {
    throw new BadRequestError("Missing registration fields");
  }
  // Check username and email uniqueness
  const existingUsername = await db.getUser(username);
  const existingEmail = await db.getUserByEmail(email);

  if (existingUsername) {
    throw new ConflictError("This username already exists.", "username");
  }
  if (existingEmail) {
    throw new ConflictError(
      "There is already an account associated with this email.",
      "email",
    );
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.createUser(username, hashedPassword, email);

  return newUser;
};

const getUserProfile = async (requestingUserId, targetUsername) => {
  const targetUser = await db.getUserByUsername(targetUsername);
  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // If it is my own profile
  if (requestingUserId === targetUser.id) {
    return await db.getUserPrivateData(targetUser.id);
  }

  // If that is someone I follow
  const isFollowing = await db.isFollowing(requestingUserId, targetUser.id);

  if (isFollowing) {
    return await db.getUserPublicData(targetUser.id);
  } else {
    return await db.getUserBasicData(targetUser.id);
  }
};

module.exports = {
  register,
  getUserProfile,
  // getUserPrivateData,
};
