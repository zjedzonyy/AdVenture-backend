const request = require("supertest");
const app = require("../../app");

const { createUser, deleteUser } = require("../utils/helper");

describe("/follow-requests", () => {
  let authCookie1;
  let testUserId1;
  let authCookie2;
  let testUserId2;
  let authCookie3;
  let testUserId3;
  const NONEXISTING_USER_ID = "99999999";
  const NONEXISTING_REQUEST_ID = "1234567";

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
    authCookie3 = user3.authCookie;
  });

  // Cleanup after tests
  afterEach(async () => {
    if (testUserId1) await deleteUser(testUserId1);
    if (testUserId2) await deleteUser(testUserId2);
    if (testUserId3) await deleteUser(testUserId3);
  });

  describe("POST /follow-requests/:userId", () => {
    it("should sent a request", async () => {
      const res = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("PENDING");
    });

    it("should thrown an error trying to send duplicate follow request", async () => {
      const res = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(200);

      const res2 = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);

      expect(res2.status).toBe(400);
    });

    it("shouldn't be able to send follow request to yourself", async () => {
      const res = await request(app)
        .post(`/follow-requests/${testUserId1}`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("BadRequestError");
      expect(res.body.message).toBe("Cannot follow yourself");
    });

    it("can't send request to non existing user", async () => {
      const res = await request(app)
        .post(`/follow-requests/${NONEXISTING_USER_ID}`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("BadRequestError");
      expect(res.body.message).toBe("Target user not found");
    });
  });

  describe("fetch follow requests", () => {
    it("fetch received requests", async () => {
      await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);

      const res2 = await request(app)
        .get(`/users/me/follow-requests`)
        .set("Cookie", authCookie2);

      expect(res2.status).toBe(200);
      expect(res2.body.message).toBe("Fetched follow requests");
      expect(res2.body.data[0].fromUserId).toEqual(testUserId1);
    });

    it("fetch sent requests", async () => {
      await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);

      const res2 = await request(app)
        .get(`/users/me/sent-follow-requests`)
        .set("Cookie", authCookie1);

      expect(res2.status).toBe(200);
      expect(res2.body.message).toBe("Fetched sent follow requests");
      expect(res2.body.data[0].fromUserId).toEqual(testUserId1);
    });

    it("fetch empty list", async () => {
      const res = await request(app)
        .get(`/users/me/sent-follow-requests`)
        .set("Cookie", authCookie3);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Fetched sent follow requests");
      expect(res.body.data.length).toEqual(0);
    });
  });

  describe("follow requests acceptance", () => {
    let requestId;
    // Create a follow request from User1 to User2
    beforeEach(async () => {
      // Send request
      const res1 = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);
      requestId = res1.body.data.id;
    });

    it("User2 accepts follow requests from User1", async () => {
      // Accept it
      const res2 = await request(app)
        .patch(`/follow-requests/${requestId}/accept`)
        .set("Cookie", authCookie2);
      // Check
      expect(res2.status).toBe(200);
      expect(res2.body.data.request.status).toBe("ACCEPTED");
      expect(res2.body.data.follow.followingId).toBe(testUserId2);
    });

    it("failed to accept someone else's request", async () => {
      const res = await request(app)
        .patch(`/follow-requests/${requestId}/accept`)
        .set("Cookie", authCookie3);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You can only accept requests sent to you");
    });

    it("failed to accept nonexisting request", async () => {
      const res = await request(app)
        .patch(`/follow-requests/${NONEXISTING_REQUEST_ID}/accept`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Follow request not found");
    });

    it("failed to accept already accepted request", async () => {
      await request(app)
        .patch(`/follow-requests/${requestId}/accept`)
        .set("Cookie", authCookie2);

      const res2 = await request(app)
        .patch(`/follow-requests/${requestId}/accept`)
        .set("Cookie", authCookie2);

      expect(res2.status).toBe(400);
      expect(res2.body.message).toBe("Can only accept pending requests");
    });
  });

  describe("follow request rejection", () => {
    let requestId;
    // Create a follow request from User1 to User2
    beforeEach(async () => {
      // Send request
      const res1 = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);
      requestId = res1.body.data.id;
    });

    it("should reject postively", async () => {
      const res = await request(app)
        .patch(`/follow-requests/${requestId}/reject`)
        .set("Cookie", authCookie2);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("REJECTED");
    });

    it("failed to reject someone else's request", async () => {
      const res = await request(app)
        .patch(`/follow-requests/${requestId}/reject`)
        .set("Cookie", authCookie3);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("You can only reject requests sent to you");
    });
  });

  describe("cancel sent request", () => {
    let requestId;
    // Create a follow request from User1 to User2
    beforeEach(async () => {
      // Send request
      const res1 = await request(app)
        .post(`/follow-requests/${testUserId2}`)
        .set("Cookie", authCookie1);
      requestId = res1.body.data.id;
    });

    it("should cancel sent follow request", async () => {
      const res = await request(app)
        .delete(`/follow-requests/sent/${requestId}`)
        .set("Cookie", authCookie1);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Request successfully deleted");
    });

    it("failed to cancel someone else's sent request", async () => {
      const res = await request(app)
        .delete(`/follow-requests/sent/${requestId}`)
        .set("Cookie", authCookie2);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Only the sender can cancel the request");
    });
  });
});
