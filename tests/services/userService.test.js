const { register } = require("../../services/userService");
const db = require("../../database/queries");
const bcrypt = require("bcryptjs");
jest.mock("../../database/queries");

describe("register", () => {
  it("should throw ConflictError if username already exists", async () => {
    db.getUser.mockResolvedValue({ id: 1 });
    await expect(
      register({
        username: "existinguser",
        password: "Password1",
        email: "email@example.com",
      })
    ).rejects.toThrow("This username already exists.");
  });
});
