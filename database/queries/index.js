// Central export of query files
const ideasQueries = require("./ideas.queries");
const usersQueries = require("./users.queries");
const commentsQueries = require("./comments.queries");
const followRequestsQueries = require("./followRequests.queries");
const followsQueries = require("./follows.queries");

module.exports = {
  ...ideasQueries,
  ...usersQueries,
  ...commentsQueries,
  ...followRequestsQueries,
  ...followsQueries,
};
