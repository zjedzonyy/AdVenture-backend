const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/queries");
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require("../utils/error.utils");
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
      if (!user)
        return done(new UnauthorizedError("Invalid username or password"));

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return done(new UnauthorizedError("Invalid username or password"));

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
