const db = require("../database/queries");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errorUtils");

const register = async ({ username, password, email }) => {
  // Check username and email uniqueness
  const existingUsername = await db.getUser(username);
  const existingEmail = await db.getUserByEmail(email);

  if (existingUsername) {
    throw new ConflictError("This username already exists.");
  }
  if (existingEmail) {
    throw new ConflictError(
      "There is already an account associated with this email."
    );
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.createUser(username, hashedPassword, email);

  return newUser;
};

module.exports = {
  register,
};
