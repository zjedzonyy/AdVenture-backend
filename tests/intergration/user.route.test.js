const request = require("supertest");
const app = require("../../app");
const db = require("../../database/queries");
// const passport = require("passport");
const bcrypt = require("bcryptjs");
const { createTestScheduler } = require("jest");

describe("User Profile Endpoint", () => {
  // Test user
  const testUser = {
    username: "testUserRoute123",
    password: "Password1",
    email: "validUserRoute123@gmail.com",
  };

  let authCookie;
  let testUserId;
  // Create a test user and get auth cookie
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create account in db
    await db.createUser(testUser.username, hashedPassword, testUser.email);
    testUserId = await db.getUser(testUser.username);
    testUserId = testUserId.id;
    // Login and auth cookie
    const response = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    // Extract cookie
    authCookie = response.headers["set-cookie"];
  });

  // Cleanup after tests
  afterAll(async () => {
    // Delete test user and it's session
    await db.deleteUserByUsername(testUser.username);
    await request(app)
      .post("/auth/logout")
      .set("Cookie", authCookie)
      .expect(200);
  });

  it("should return 401 when user is not authenticated", async () => {
    const res = await request(app).get(`/users/${testUserId}`);
    expect(res.status).toBe(401);
    expect(res.body.name).toBe("UnauthorizedError");
  });

  it("should return user profile when authenticated", async () => {
    const res = await request(app)
      .get(`/users/${testUserId}`)
      .set("Cookie", authCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("username", testUser.username);
    expect(res.body.data).toHaveProperty("email", testUser.email);
    expect(res.body.data.ideas).toBeInstanceOf(Array);

    expect(res.body.data).not.toHaveProperty("password"); // Ensure password is not returned!!
  });

  it("should return 401 with invalid session", async () => {
    const invalidCookie = "connect.sid=s%3AinvalidSessionId.invalidSignature";

    const response = await request(app)
      .get("/users/me")
      .set("Cookie", invalidCookie);

    expect(response.status).toBe(401);
  });
});
