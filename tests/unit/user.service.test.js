const { register } = require("../../services/user.service");
const db = require("../../database/queries");
const { BadRequestError } = require("../../utils/error.utils");
jest.mock("../../database/queries");

describe("register", () => {
  it("should throw ConflictError if username already exists", async () => {
    db.getUser.mockResolvedValue({ id: 1 });
    await expect(
      register({
        username: "existinguser",
        password: "Password1",
        email: "email@example.com",
      }),
    ).rejects.toThrow("This username already exists.");
  });
  it("should throw ConflictError if email already exists", async () => {
    db.getUser.mockResolvedValue(null);
    db.getUserByEmail.mockResolvedValue({ id: 1 });
    await expect(
      register({
        username: "newuser",
        password: "Password1",
        email: "exstinig@gmail.com",
      }),
    ).rejects.toThrow(
      "There is already an account associated with this email.",
    );
  });
  it("should create a new user if username and email are unique", async () => {
    db.getUser.mockResolvedValue(null);
    db.getUserByEmail.mockResolvedValue(null);
    db.createUser.mockResolvedValue({ id: 1, username: "newuser" });

    const result = await register({
      username: "newuser",
      password: "Password1",
      email: "new@gmail.com",
    });

    expect(db.getUser).toHaveBeenCalledWith("newuser");
    expect(db.getUserByEmail).toHaveBeenCalledWith("new@gmail.com");
    expect(db.createUser).toHaveBeenCalledWith(
      "newuser",
      expect.any(String), // hashed password
      "new@gmail.com",
    );
    expect(result).toEqual({ id: 1, username: "newuser" });
  });

  it("should throw BadRequestError if missing parameters", async () => {
    const testCases = [
      {
        username: "",
        password: "ValidPassword1",
        email: "valid@gmail.com",
      },
      {
        user: "validuser",
        password: "",
        email: "valid@gmail.com",
      },
    ];

    for (const testCase of testCases) {
      await expect(() => register(testCase).rejects.toThrow(BadRequestError));
    }
  });
});
