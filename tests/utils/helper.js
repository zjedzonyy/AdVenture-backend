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
  const username = `UserForTest_${Date.now()}`;
  const password = "Password1";
  const hashedPassword = await bcrypt.hash(password, 10);
  const email = `test_${Date.now()}@gmail.com`;
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
    console.error("createUser error: ", error);
  }

  return { testUserId, authCookie };
};

const deleteUser = async (id) => {
  await db.deleteUserById(id);
};

module.exports = {
  removeSession,
  createUser,
  deleteUser,
};
