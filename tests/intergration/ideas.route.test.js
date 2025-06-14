const request = require("supertest");
const app = require("../../app");
const db = require("../../database/queries");
// const passport = require("passport");
const bcrypt = require("bcryptjs");
const {
  createUser,
  deleteUser,
  createIdea,
  deleteIdea,
} = require("../utils/helper");

describe("/ideas", () => {
  let authCookie;
  let testUserId;

  // Create a test user and get auth cookie
  beforeEach(async () => {
    const user = await createUser();
    testUserId = user.testUserId;
    authCookie = user.authCookie;
  });

  // Cleanup after tests
  afterEach(async () => {
    await deleteUser(testUserId);
  });

  describe("GET /ideas", () => {
    it("should return 200", async () => {
      const res = await request(app).get("/ideas").set("Cookie", authCookie);
      expect(res.status).toBe(200);
    });

    it("should respect limit filter", async () => {
      const res = await request(app)
        .get("/ideas?limit=5")
        .set("Cookie", authCookie);
      expect(res.body.data.ideas.length).toBeLessThanOrEqual(5);
    });
  });

  describe("/ideas/:id", () => {
    it("should return 200", async () => {
      const res = await request(app).get("/ideas/1").set("Cookie", authCookie);
      expect(res.status).toBe(200);
    });
  });

  describe("/ideas/:id/comments", () => {
    it("should return 200", async () => {
      const res = await request(app)
        .get("/ideas/1/comments")
        .set("Cookie", authCookie);
      expect(res.status).toBe(200);
    });
  });

  describe("/ideas/lucky", () => {
    it("should return 200", async () => {
      const res = await request(app)
        .get("/ideas/lucky")
        .set("Cookie", authCookie);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /ideas", () => {
    it("should return 200", async () => {
      // const ideaId = await createIdea(testUserId);
      const res = await request(app)
        .post("/ideas")
        .set("Cookie", authCookie)
        .send({
          authorId: testUserId,
          title: `Its just a testing title_${Date.now()}`,
          description: "It's just a testing description.",
          isActive: true,
          isChallenge: false,
          durationId: 1,
          priceRangeId: 1,
          locationType: "INDOOR",
          categories: [2, 5],
          groups: [1, 2],
        });

      expect(res.status).toBe(200);
      await deleteIdea(res.body.ideaId);
    });
  });
});
