const request = require("supertest");
const app = require("../../app");
const db = require("../../database/queries");
// const passport = require("passport");
const bcrypt = require("bcryptjs");

describe("User Profile Endpoint", () => {
  // Test user
  const testUser = {
    username: "testUserRoute123",
    password: "Password1",
    email: "validUserRoute123@gmail.com",
  };

  let authCookie;

  // Create a test user and get auth cookie
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create account in db
    await db.createUser(testUser.username, hashedPassword, testUser.email);

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
    const sidCookie = authCookie.find((cookie) =>
      cookie.startsWith("connect.sid"),
    );
    const match = sidCookie.match(/connect\.sid=s%3A([^.;]+)\./);
    const sid = match?.[1];

    await db.deleteSessionBySid(sid);
  });

  it("should return 401 when user is not authenticated", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(401);
    expect(res.body.name).toBe("UnauthorizedError");
  });

  it("should return user profile when authenticated", async () => {
    const res = await request(app).get("/users/me").set("Cookie", authCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("username", testUser.username);
    expect(res.body.data).toHaveProperty("email", testUser.email);
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
