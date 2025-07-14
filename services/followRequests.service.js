const db = require("../database/queries/index");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/error.utils");

// Check if:
// -user sent follow to herself
// -her target exists
// -already sent a follow request
// then return request
const checkRequest = async (requestingUserId, targetId) => {
  if (requestingUserId === targetId) {
    throw new BadRequestError("Cannot follow yourself");
  }
  const targetUser = await db.getUserById(targetId);
  if (!targetUser) {
    throw new BadRequestError("Target user not found");
  }
  const existingRequest = await db.getExistingRequest(
    requestingUserId,
    targetId,
  );

  return existingRequest;
};

const sendFollowRequest = async (requestingUserId, targetId) => {
  const existingRequest = await checkRequest(requestingUserId, targetId);
  if (existingRequest) {
    if (existingRequest.status === "PENDING") {
      throw new BadRequestError("Follow request already sent");
    } else if (existingRequest.status === "ACCEPTED") {
      throw new BadRequestError("Already following this user");
    }
  }

  // Create a new follow request
  const sendFollowRequest = await db.sendFollowRequest(
    requestingUserId,
    targetId,
  );

  return sendFollowRequest;
};

const cancelFollowRequest = async (requestingUserId, toUserId) => {
  const existingRequest = await db.getFollowRequest(requestingUserId, toUserId);

  if (!existingRequest) {
    throw new BadRequestError("Follow request not found");
  }

  if (existingRequest.fromUserId !== requestingUserId) {
    throw new BadRequestError("Only the sender can cancel the request");
  }

  if (existingRequest.status !== "PENDING") {
    throw new BadRequestError("Can only cancel pending requests");
  }

  const requestId = existingRequest.id;
  await db.deleteFollowRequest(requestId);
};

const acceptRequest = async (followRequestId, requestingUserId) => {
  const followRequest = await db.getFollowRequestById(followRequestId);
  if (!followRequest) {
    throw new BadRequestError("Follow request not found");
  }
  if (followRequest.fromUserId === requestingUserId) {
    throw new BadRequestError("Cannot accept your own request");
  }
  if (followRequest.toUserId !== requestingUserId) {
    throw new BadRequestError("You can only accept requests sent to you");
  }
  if (followRequest.status !== "PENDING") {
    throw new BadRequestError("Can only accept pending requests");
  }

  const accept = await db.acceptFollowRequest(followRequestId);

  return accept;
};

const rejectRequest = async (followRequestId, requestingUserId) => {
  const followRequest = await db.getFollowRequestById(followRequestId);

  if (!followRequest) {
    throw new BadRequestError("Follow request not found");
  }
  if (followRequest.fromUserId === requestingUserId) {
    throw new BadRequestError("Cannot reject your own request");
  }
  if (followRequest.toUserId !== requestingUserId) {
    throw new BadRequestError("You can only reject requests sent to you");
  }
  if (followRequest.status !== "PENDING") {
    throw new BadRequestError("Can only reject pending requests");
  }

  const accept = await db.rejectFollowRequest(followRequestId);

  return accept;
};
module.exports = {
  sendFollowRequest,
  cancelFollowRequest,
  acceptRequest,
  rejectRequest,
};
