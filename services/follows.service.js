const db = require("../database/queries/index");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/error.utils");

const unfollowUser = async (requestingUserId, targetId) => {
  const userFollow = await db.getUserFollowing(requestingUserId, targetId);

  if (!userFollow || userFollow.followerId !== requestingUserId) {
    throw new BadRequestError("You're not following that user");
  }

  await db.unfollowUser(requestingUserId, targetId);
};

const removeFollower = async (requestingUserId, targetId) => {
  const userFollow = await db.getUsersFollower(requestingUserId, targetId);
  if (!userFollow) {
    throw new BadRequestError("This user is not following you");
  }

  await db.removeFollower(requestingUserId, targetId);
};

module.exports = {
  unfollowUser,
  removeFollower,
};
