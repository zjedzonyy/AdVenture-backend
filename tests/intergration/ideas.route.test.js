const request = require("supertest");
const app = require("../../app");
const db = require("../../database/queries");
// const passport = require("passport");
const bcrypt = require("bcryptjs");

describe("/ideas", () => {
  // Test user
  const testUser = {
    username: "testUserRoute1234",
    password: "Password1",
    email: "validUserRoute1234@gmail.com",
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
  it("should provide a valid response", async () => {
    const res = await request(app).get("/ideas").set("Cookie", authCookie);
    expect(res.status).toBe(200);
  });

  it("check limit filter", async () => {
    const res = await request(app)
      .get("/ideas?limit=5")
      .set("Cookie", authCookie);
    expect(res.body.data.ideas.length).toBeLessThanOrEqual(5);
  });
});
