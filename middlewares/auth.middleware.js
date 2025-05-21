const { UnauthorizedError } = require("../utils/error.utils");

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new UnauthorizedError();
  }
}

module.exports = {
  requireAuth,
};
