const db = require("../database/queries");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);
beforeAll(() => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("🚨 TESTS ONLY IN TEST ENV!");
  }
});
