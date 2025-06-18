const db = require("../../database/queries/index");
const bcrypt = require("bcryptjs");
const request = require("supertest");
const app = require("../../app");
// Get the cookie and remove it from db
const removeSession = async (res) => {
  const authCookie = res.headers["set-cookie"];

  if (!authCookie) return;

  const sidCookie = authCookie.find((cookie) =>
    cookie.startsWith("connect.sid"),
  );

  const match = sidCookie?.match(/connect\.sid=s%3A([^.;]+)\./);
  const sid = match?.[1];

  if (sid) {
    await db.deleteSessionBySid(sid);
  }
};

const createUser = async (userRole = "USER") => {
  const suffix = Math.random().toString(36).substring(2, 8);
  const username = `UserForTest_${suffix}`;
  const password = "Password1";
  const hashedPassword = await bcrypt.hash(password, 1);
  const email = `test_${suffix}@gmail.com`;
  const role = userRole === "USER" ? "USER" : "ADMIN";

  let authCookie;
  let testUserId;

  try {
    // Create account and save user.id
    testUserId = await db.createUser(username, hashedPassword, email, role);
    if (!testUserId) {
      throw new Error("Couldn't create user for some reason...");
    }

    // Login and get the cookie
    const res = await request(app).post("/auth/login").send({
      username,
      password,
    });
    if (res.status !== 200) {
      throw new Error(`Login failed with status ${res.status}: ${res.text}`);
    }

    // Extract the cookie
    authCookie = res.headers["set-cookie"];
  } catch (error) {
    throw new Error(`createUser failed: ${error.message}`);
  }

  return { testUserId, authCookie };
};

const deleteUser = async (id) => {
  await db.deleteUserById(id);
};

const deleteIdea = async (ideaId) => {
  await db.deleteIdea(ideaId);
};

// Create Idea and return its id
const createIdea = async (authorId) => {
  const ideaData = {
    authorId,
    title: `Its just a testing title_${Date.now()}`,
    description: "It's just a testing description.",
    isActive: true,
    isChallenge: false,
    durationId: 1,
    priceRangeId: 1,
    locationType: "INDOOR",
    categories: [2, 5],
    groups: [1, 2],
  };

  const ideaId = await db.createIdea(ideaData);

  return ideaId;
};

module.exports = {
  removeSession,
  createUser,
  deleteUser,
  createIdea,
  deleteIdea,
};
