const prisma = require("../prisma");

async function createUser(username, hashedPassword, email, role = "USER") {
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
    },
  });
  if (!newUser) {
    throw new Error("Couldn't create a user");
  }

  return newUser.id;
}

async function getUser(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

async function getUserPrivateData(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      profileViewCount: true,
      ideas: true,
      comments: true,
      reviews: true,
      follower: true,
      following: true,
      ideaStatus: true,
      role: true,
    },
  });

  return user;
}

async function getUserPublicData(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      username: true,
      createdAt: true,
      profileViewCount: true,
      ideas: true,
      comments: true,
      follower: true,
      following: true,
      ideaStatus: true,
      role: true,
    },
  });

  return user;
}

async function getUserBasicData(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      username: true,
      createdAt: true,
      profileViewCount: true,
      follower: true,
      following: true,
    },
  });

  return user;
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

async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}
async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
    },
  });

  return users;
}

async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  return user;
}

async function deleteUserByUsername(username) {
  await prisma.user.delete({
    where: {
      username: username,
    },
  });
}

async function deleteUserById(id) {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}

async function deleteUserByEmail(email) {
  await prisma.user.delete({
    where: {
      email: email,
    },
  });
}

async function deleteSessionBySid(sid) {
  await prisma.session.delete({
    where: {
      sid: sid,
    },
  });
}

async function createNewChat(id1, id2) {
  const newChat = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: id1 }, { id: id2 }],
      },
    },
  });

  return newChat;
}

async function addChatParticipant(chatId, id1, id2) {
  await prisma.chatParticipant.createMany({
    data: [
      {
        chatId: chatId,
        userId: id1,
      },
      {
        chatId: chatId,
        userId: id2,
      },
    ],
  });
}

async function createNewMessage(chatId, text, userId) {
  await prisma.message.create({
    data: {
      text: text,
      chat: {
        connect: { id: chatId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
}

async function getChatMessages(chatId) {
  const messages = await prisma.message.findMany({
    where: {
      chatsId: chatId,
    },
  });

  return messages;
}

async function getUsersWithCommonChats(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`User with username ${username} not found`);
  }

  const usersWithChats = await prisma.user.findMany({
    where: {
      username: {
        not: username,
      },
    },
    select: {
      username: true,
      chats: {
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  return usersWithChats.map((u) => ({
    username: u.username,
    chatId: u.chats.length > 0 ? u.chats[0].id : null,
  }));
}

async function getUsersIdeaStatus(userId, ideaId) {
  const usersIdeaStatus = await prisma.userIdeaStatus.findUnique({
    where: {
      userId_ideaId: [userId, ideaId],
    },
  });

  return usersIdeaStatus;
}

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

async function getFollowRequest(followRequestId) {
  const res = await prisma.followRequest.findUnique({
    where: {
      id: followRequestId,
    },
  });

  return res;
}

async function deleteFollowRequest(requestingUserId, targetId) {
  const existingRequest = await prisma.followRequest.delete({
    where: {
      fromUserId_toUserId: {
        fromUserId: requestingUserId,
        toUserId: targetId,
      },
    },
  });
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
}

async function getUsersFollowRequests(requestingUserId) {
  const res = await prisma.followRequest.findMany({
    where: {
      toUserId: requestingUserId,
    },
  });

  return res;
}

async function getUsersSentFollowRequests(requestingUserId) {
  const res = await prisma.followRequest.findMany({
    where: {
      fromUserId: requestingUserId,
    },
  });

  return res;
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

async function removeFollower(requestingUserId, targetId) {
  await prisma.userFollow.delete({
    where: {
      followerId_followingId: {
        followerId: targetId,
        followingId: requestingUserId,
      },
    },
  });
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  createNewChat,
  addChatParticipant,
  createNewMessage,
  getChatMessages,
  getUsersWithCommonChats,
  deleteUserByUsername,
  deleteUserByEmail,
  deleteSessionBySid,
  getUserPrivateData,
  isFollowing,
  getUserPublicData,
  getUserBasicData,
  deleteUserById,
  getExistingRequest,
  deleteFollowRequest,
  getFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getUserFollowing,
  unfollowUser,
  getUsersFollowRequests,
  getUsersSentFollowRequests,
  getUsersFollower,
  removeFollower,
  sendFollowRequest,
  deleteFollowRequestByRequestId,
};
