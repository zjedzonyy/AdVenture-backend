const db = require("../database/queries");
const bcrypt = require("bcryptjs");
const { BadRequestError, ConflictError } = require("../utils/error.utils");

const register = async ({ username, password, email }) => {
  if (!username || !password || !email) {
    throw new BadRequestError("Missing registration fields");
  }
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
