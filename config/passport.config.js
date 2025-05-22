const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/queries");
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require("../utils/error.utils");
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
      if (!user) return done(new UnauthorizedError("Invalid username"));

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(new UnauthorizedError("Invalid password"));

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// Send user.id on successfull login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// On request get id and fetch user's data from db
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
