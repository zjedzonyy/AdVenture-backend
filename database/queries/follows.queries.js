const prisma = require("../prisma");
async function removeFollower(requestingUserId, targetId) {
  await prisma.userFollow.delete({
    where: {
      followerId_followingId: {
        followerId: targetId,
        followingId: requestingUserId,
      },
    },
  });
  // Destroy follow request if exists
  const existingRequest = await prisma.followRequest.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: targetId,
        toUserId: requestingUserId,
      },
    },
  });
  if (existingRequest) {
    await prisma.followRequest.delete({
      where: {
        id: existingRequest.id,
      },
    });
  }
}

async function getUserFollowers(targetId) {
  const users = await prisma.userFollow.findMany({
    where: {
      followingId: targetId,
    },
    select: {
      id: true,
      createdAt: true,
      followerId: true,
      follower: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    followerUsername: user.follower.username,
    avatarUrl: user.follower.avatarUrl,
    follower: undefined,
  }));
}

async function getUserFollowings(targetId) {
  const users = await prisma.userFollow.findMany({
    where: {
      followerId: targetId,
    },
    select: {
      id: true,
      createdAt: true,
      followingId: true,
      following: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    followingUsername: user.following.username,
    avatarUrl: user.following.avatarUrl,
    following: undefined,
  }));
}

async function getUsersFollower(requestingUserId, targetId) {
  const res = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: targetId,
        followingId: requestingUserId,
      },
    },
  });
  return res;
}

async function getUserFollowing(requestingUserId, targetId) {
  const res = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: requestingUserId,
        followingId: targetId,
      },
    },
  });

  return res;
}

async function unfollowUser(requestingUserId, targetId) {
  await prisma.userFollow.delete({
    where: {
      followerId_followingId: {
        followerId: requestingUserId,
        followingId: targetId,
      },
    },
  });

  // Destroy follow request if exists
  const existingRequest = await prisma.followRequest.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: requestingUserId,
        toUserId: targetId,
      },
    },
  });
  if (existingRequest) {
    await prisma.followRequest.delete({
      where: {
        id: existingRequest.id,
      },
    });
  }
}

async function isFollowing(followerId, followingId) {
  const user = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return user;
}
module.exports = {
  removeFollower,
  getUserFollowers,
  getUserFollowings,
  getUsersFollower,
  getUserFollowing,
  unfollowUser,
  isFollowing,
};
