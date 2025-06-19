const request = require("supertest");
const app = require("../../app");

const { createUser, deleteUser } = require("../utils/helper");

describe("menaging followers and followings", () => {
  let authCookie1;
  let testUserId1;
  let authCookie2;
  let testUserId2;
  let testUserId3;
  let requestId;

  // Create test users and get auth cookieS
  beforeEach(async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const user3 = await createUser();

    testUserId1 = user1.testUserId;
    authCookie1 = user1.authCookie;
    testUserId2 = user2.testUserId;
    authCookie2 = user2.authCookie;
    testUserId3 = user3.testUserId;

    // Send request
    const res1 = await request(app)
      .post(`/follow-requests/${testUserId2}`)
      .set("Cookie", authCookie1);
    requestId = res1.body.data.id;

    // Accept it
    await request(app)
      .patch(`/follow-requests/${requestId}/accept`)
      .set("Cookie", authCookie2);
  });

  // Cleanup after tests
  afterEach(async () => {
    if (testUserId1) await deleteUser(testUserId1);
    if (testUserId2) await deleteUser(testUserId2);
    if (testUserId3) await deleteUser(testUserId3);
  });

  //   USER 1 IS FOLLOWING USER 2
  describe("remove follower", () => {
    it("should remove follower", async () => {
      const res = await request(app)
        .delete(`/follows/${testUserId1}/remove`)
        .set("Cookie", authCookie2);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User is not following you anymore");
    });

    it("failed to remove someone who's not a follower", async () => {
      const res = await request(app)
        .delete(`/follows/${testUserId3}/remove`)
        .set("Cookie", authCookie2);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("This user is not following you");
    });
  });

  describe("unfollow someone", () => {
    it("should unfollow the user", async () => {
      const res = await request(app)
        .delete(`/follows/${testUserId2}/unfollow`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("You have unfollowed user");
    });

    it("failed to unfollow someone who's not being followed", async () => {
      const res = await request(app)
        .delete(`/follows/${testUserId3}/unfollow`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You're not following that user");
    });
  });
});
