const {
  buildOrderByClause,
  getAllIdeas,
} = require("../../services/ideas.service");

const db = require("../../database/queries");
const { BadRequestError } = require("../../utils/error.utils");
// jest.mock("../../database/queries");

describe("buildOrderByClause", () => {
  it("check for valid output", () => {
    const testCases = [
      {
        key: "oldest",
        value: { createdAt: "asc" },
      },
      {
        key: "least_rating",
        value: { averageRating: "asc" },
      },
      {
        key: "least_completed",
        value: { completionCount: "asc" },
      },
    ];
    for (const item of testCases) {
      const result = buildOrderByClause(item.key);
      expect(result).toEqual(item.value);
    }
  });

  it("returns validSorts.newest for invalid inputs", () => {
    const testCases = [
      "-1",
      2,
      -5,
      2.9124,
      "random",
      [1, -5, "asdf"],
      null,
      undefined,
    ];
    const value = { createdAt: "desc" };
    for (const item of testCases) {
      const result = buildOrderByClause(item);
      expect(result).toEqual(value);
    }
  });
});

describe("getAllIdeas", () => {
  it("basic test", async () => {
    const filters = {
      view_count_max: "50",
    };
    const userId = "7462076e-2001-4bc9-b468-0c5300d176b6";
    const result = await getAllIdeas(filters, userId);

    expect(result).toHaveProperty("ideas");
    expect(result).toHaveProperty("pagination");
  });
});
