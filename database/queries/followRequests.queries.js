const prisma = require("../prisma");

// Only for sending follow request!
async function sendFollowRequest(requestingUserId, targetId) {
  const followRequest = await prisma.followRequest.upsert({
    where: {
      fromUserId_toUserId: {
        fromUserId: requestingUserId,
        toUserId: targetId,
      },
    },
    update: {
      status: "PENDING",
      createdAt: new Date(),
    },
    create: {
      fromUserId: requestingUserId,
      toUserId: targetId,
      status: "PENDING",
    },
  });

  return followRequest;
}

async function getExistingRequest(requestingUserId, targetId) {
  const existingRequest = await prisma.followRequest.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: requestingUserId,
        toUserId: targetId,
      },
    },
  });

  return existingRequest;
}

async function getFollowRequest(requestingUserId, toUserId) {
  const res = await prisma.followRequest.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: requestingUserId,
        toUserId: toUserId,
      },
    },
  });

  return res;
}

async function getFollowRequestById(requestId) {
  const res = await prisma.followRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  return res;
}

async function deleteFollowRequest(requestId) {
  const existingRequest = await prisma.followRequest.delete({
    where: {
      id: requestId,
    },
  });

  return existingRequest;
}

async function deleteFollowRequestByRequestId(requestId) {
  await prisma.followRequest.delete({
    where: {
      id: requestId,
    },
  });
}

async function acceptFollowRequest(followRequestId) {
  const result = await prisma.$transaction(async (tx) => {
    const accept = await tx.followRequest.update({
      where: {
        id: followRequestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    const follow = await tx.userFollow.create({
      data: {
        followerId: accept.fromUserId,
        followingId: accept.toUserId,
      },
    });
    return { request: accept, follow };
  });
  return result;
}

async function rejectFollowRequest(followRequestId) {
  const res = await prisma.followRequest.update({
    where: {
      id: followRequestId,
    },
    data: {
      status: "REJECTED",
    },
  });

  return res;
}

async function getUsersFollowRequests(requestingUserId) {
  const res = await prisma.followRequest.findMany({
    where: {
      toUserId: requestingUserId,
      status: "PENDING",
    },
    select: {
      id: true,
      fromUserId: true,
      status: true,
      createdAt: true,
      fromUser: {
        select: {
          avatarUrl: true,
          username: true,
        },
      },
    },
  });

  return res.map((item) => ({
    ...item,
    fromUsername: item.fromUser.username,
    avatarUrl: item.fromUser.avatarUrl,
    fromUser: undefined,
  }));
}

async function getUsersSentFollowRequests(requestingUserId) {
  const res = await prisma.followRequest.findMany({
    where: {
      fromUserId: requestingUserId,
      status: "PENDING",
    },
    select: {
      id: true,
      toUserId: true,
      status: true,
      createdAt: true,
      toUser: {
        select: {
          avatarUrl: true,
          username: true,
        },
      },
    },
  });

  return res.map((item) => ({
    ...item,
    toUsername: item.toUser.username,
    avatarUrl: item.toUser.avatarUrl,
    toUser: undefined,
  }));
}

module.exports = {
  sendFollowRequest,
  getExistingRequest,
  getFollowRequest,
  getFollowRequestById,
  deleteFollowRequest,
  deleteFollowRequestByRequestId,
  acceptFollowRequest,
  rejectFollowRequest,
  getUsersFollowRequests,
  getUsersSentFollowRequests,
};
