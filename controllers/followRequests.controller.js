const followRequestsService = require("../services/followRequests.service");

const sendFollowRequest = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const targetId = req.params.userId;

    const followRequest = await followRequestsService.sendFollowRequest(
      requestingUserId,
      targetId,
    );

    res.status(200).json({
      success: true,
      message: `Request successfully created, status: ${followRequest.status}`,
      data: followRequest,
    });
  } catch (error) {
    next(error);
  }
};

const cancelFollowRequest = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const toUserId = req.params.userId;

    await followRequestsService.cancelFollowRequest(requestingUserId, toUserId);

    res.status(200).json({
      success: true,
      message: `Request successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const followRequestId = Number(req.params.requestId);
    const requestingUserId = req.user.id;

    const accepted = await followRequestsService.acceptRequest(
      followRequestId,
      requestingUserId,
    );

    res.status(200).json({
      success: true,
      message: `Request successfully accepted`,
      data: accepted,
    });
  } catch (error) {
    next(error);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const followRequestId = Number(req.params.requestId);
    const requestingUserId = req.user.id;

    const rejected = await followRequestsService.rejectRequest(
      followRequestId,
      requestingUserId,
    );

    res.status(200).json({
      success: true,
      message: `Request successfully rejected`,
      data: rejected,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendFollowRequest,
  cancelFollowRequest,
  acceptRequest,
  rejectRequest,
};
