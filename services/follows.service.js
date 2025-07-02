const db = require("../database/queries/index");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
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

const getFollowers = async (requestingUserId, targetId) => {
  if (requestingUserId === targetId) {
    return await db.getUserFollowers(targetId);
  }

  // If that is someone I follow
  const isFollowing = await db.isFollowing(requestingUserId, targetId);
  if (isFollowing) {
    return await db.getUserFollowers(targetId);
  } else {
    throw new ForbiddenError("You must follower the User to see her details");
  }
};

const getFollowings = async (requestingUserId, targetId) => {
  if (requestingUserId === targetId) {
    return await db.getUserFollowings(targetId);
  }

  // If that is someone I follow
  const isFollowing = await db.isFollowing(requestingUserId, targetId);
  if (isFollowing) {
    return await db.getUserFollowings(targetId);
  } else {
    throw new ForbiddenError("You must follower the User to see her details");
  }
};

module.exports = {
  unfollowUser,
  removeFollower,
  getFollowers,
  getFollowings,
};
