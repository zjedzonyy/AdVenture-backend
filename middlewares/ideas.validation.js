const { body, validationResult } = require("express-validator");
const { BadRequestError } = require("../utils/error.utils");

const validateIdea = [
  body("title")
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),

  body("isActive")
    .isBoolean({ strict: true })
    .withMessage("isActive must be a boolean"),

  body("isChallenge")
    .isBoolean({ strict: true })
    .withMessage("isChallenge must be a boolean"),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("Categories must be a non-empty array")
    .custom((categories) => {
      if (!categories.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("All category IDs must be positive integers");
      }
      return true;
    }),

  body("groups")
    .isArray({ min: 1 })
    .withMessage("Groups must be a non-empty array")
    .custom((groups) => {
      if (!groups.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("All group IDs must be positive integers");
      }
      return true;
    }),

  body("priceRangeId")
    .isInt({ min: 1 })
    .withMessage("Price range ID must be a positive integer"),

  body("locationType")
    .isString()
    .isIn(["INDOOR", "OUTDOOR", "HYBRID", "FLEXIBLE"])
    .withMessage("Location type must be valid"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new BadRequestError(errorMessages.join(", "));
    }
    next();
  },
];

module.exports = {
  validateIdea,
};
