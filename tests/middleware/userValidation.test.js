const request = require("supertest");
const app = require("../../app");

describe("userValidation", () => {
  it("should fail if username is too short", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "ab",
      email: "test@example.com",
      password: "Password1",
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe("BadRequestError");
    expect(res.body.message).toMatch(/Username must be between/);
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

  // it("should pass with valid data", async () => {
  //   const res = await request(app).post("/auth/register").send({
  //     username: "validuser",
  //     email: "validuser@gmail.com",
  //     password: "ValidPassword1",
  //   });
  //   expect(res.status).toBe(201);
  //   expect(res.body).toBe("User created successfully!");
  // });
});
