const request = require("supertest");
const app = require("../../app");
const passport = require("passport");
const db = require("../../database/queries");

describe("userValidation", () => {
  it("should fail if username is invalid", async () => {
    const testCases = [
      {
        username: "",
        message: "Username must be between 3 and 30 characters",
      },
      {
        username: "ab",
        message: "Username must be between 3 and 30 characters",
      },
      {
        username: "abab".repeat(21),
        message: "Username must be between 3 and 30 characters",
      },
      {
        username: "user@name",
        message: "Username can only contain letters, numbers and underscores",
      },
    ];
    for (const testCase of testCases) {
      const res = await request(app).post("/auth/register").send({
        username: testCase.username,
        email: "valid@gmail.com",
        password: "Password1",
      });
      expect(res.status).toBe(400);
      expect(res.body.name).toBe("BadRequestError");
      expect(res.body.message).toMatch(testCase.message);
    }
  });

  it("should fail if password is too weak", async () => {
    const testCases = [
      {
        password: "weak",
        message: "Password must be at least 8 characters long",
      },
      {
        password: "12345678",
        message: "Password must contain at least one uppercase letter",
      },
      {
        password: "PASSWORD",
        message: "Password must contain at least one number",
      },
    ];
    for (const testCase of testCases) {
      const res = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "validmail@gmail.com",
        password: testCase.password,
      });
      expect(res.status).toBe(400);
      expect(res.body.name).toBe("BadRequestError");
      expect(res.body.message).toMatch(testCase.message);
    }
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "invalidemail",
      password: "Password1",
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe("BadRequestError");
    expect(res.body.message).toMatch(/Please provide a valid email address/);
  });

  it("should pass with valid data", async () => {
    const uniqueUsername = `testuser_${Date.now()}`;
    const res = await request(app).post("/auth/register").send({
      username: uniqueUsername,
      password: "ValidPassword1",
      email: "valid@gmail.com",
    });
    expect(res.status).toBe(201);
    expect(res.body).toBe("User created successfully!");

    // Remove created user from database
    await db.deleteUserByUsername(uniqueUsername);
  });

  it("should failed with existing username", async () => {
    // Create user
    const uniqueUsername = `testUser_${Date.now()}`;
    await db.createUser(uniqueUsername, "Password1", "valid@gmail.com");

    // Now it should fail
    const res = await request(app).post("/auth/register").send({
      username: uniqueUsername,
      password: "Password1",
      email: "valid@gmail.com",
    });
    expect(res.status).toBe(409);
    expect(res.body.name).toBe("ConflictError");

    // Clear from database
    await db.deleteUserByUsername(uniqueUsername);
  });

  it("should failed with existing email", async () => {
    const uniqueEmail = `testmail${Date.now()}@gmail.com`;
    await db.createUser("validUsername11", "Password1", uniqueEmail);

    const res = await request(app).post("/auth/register").send({
      username: "differentButValid",
      password: "Password1",
      email: uniqueEmail,
    });
    expect(res.status).toBe(409);
    expect(res.body.name).toBe("ConflictError");

    await db.deleteUserByEmail(uniqueEmail);
  });
});
