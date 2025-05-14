const bcrypt = require("bcryptjs");
const db = require("../database/queries");

async function registerUser(req, res, next) {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, hashedPassword, email);
    res.json("User has been created!");
  } catch (error) {
    console.error(error);
    next();
  }
}

module.exports = {
  registerUser,
};
