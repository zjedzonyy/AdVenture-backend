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
};
