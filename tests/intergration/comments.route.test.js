const request = require("supertest");
const app = require("../../app");

const {
  createUser,
  deleteUser,
  createIdea,
  deleteIdea,
} = require("../utils/helper");
const { idea } = require("../../database/prisma");

describe("comments route", () => {
  let authCookie;
  let testUserId;
  let commentId;
  const ideaId = 1;
  const NONEXISTING_IDEA_ID = 987631;

  beforeEach(async () => {
    const user = await createUser();
    testUserId = user.testUserId;
    authCookie = user.authCookie;
  });

  afterEach(async () => {
    if (testUserId) await deleteUser(testUserId);
  });

  describe("fetching comments for idea", () => {
    it("should fetch comments", async () => {
      const res = await request(app)
        .get(`/comments/${ideaId}`)
        .set("Cookie", authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.comments.length).toBe(1);
      expect(typeof res.body.data.pagination).toBe("object");
    });

    it("failed to fetch comment for nonexisting idea", async () => {
      const res = await request(app)
        .get(`/comments/${NONEXISTING_IDEA_ID}`)
        .set("Cookie", authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Idea not found");
    });

    it("endpoint works with filters", async () => {
      const res = await request(app)
        .get(`/comments/${ideaId}/?limit=0`)
        .set("Cookie", authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.totalCount).toBe(1);
    });
  });

  describe("creating comments", () => {
    it("should create a comment", async () => {
      const res = await request(app)
        .post(`/comments/${ideaId}`)
        .set("Cookie", authCookie)
        .send({ description: "It's a comment for automated test" });

      expect(res.status).toBe(200);
      expect(res.body.data.ideaId).toBe(ideaId);
    });
  });

  describe("deleting comments", () => {
    it("should delete a comment", async () => {
      const res1 = await request(app)
        .post(`/comments/${ideaId}`)
        .set("Cookie", authCookie)
        .send({ description: "It's a comment for automated test" });
      commentId = res1.body.data.id;
      const res = await request(app)
        .delete(`/comments/${commentId}`)
        .set("Cookie", authCookie);

      expect(res.status).toBe(200);
    });
  });

  describe("updating comments", () => {
    it("should update a comment", async () => {
      const res1 = await request(app)
        .post(`/comments/${ideaId}`)
        .set("Cookie", authCookie)
        .send({ description: "It's a comment for automated test" });
      commentId = res1.body.data.id;

      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set("Cookie", authCookie)
        .send({ description: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Comment updated");
    });
  });

  //   describe("menaging likes", () => {
  //     beforeEach(async () => {});
  //     it("should like a comment", async () => {
  //       const res = await request(app).post("/comments/");
  //     });
  //   });
});
