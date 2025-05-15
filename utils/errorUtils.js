// Base HTTP error class that extends the built-in Error object.
// Adds HTTP status code and captures stack trace for better debugging.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends HttpError {
  constructor(message = "Invalid request") {
    super(400, message);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(404, message);
  }
}

class ConflictError extends HttpError {
  constructor(message = "Data conflict") {
    super(409, message);
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
