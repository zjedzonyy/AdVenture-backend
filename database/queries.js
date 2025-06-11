const prisma = require("./prisma");

async function createUser(username, hashedPassword, email) {
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email,
    },
  });

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

async function getAllIdeas(where, orderBy, skip, limit) {
  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    skip: skip,
    take: limit,
  });

  const totalCount = await prisma.idea.count({ where });

  return [ideas, totalCount];
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
  getAllIdeas,
};
