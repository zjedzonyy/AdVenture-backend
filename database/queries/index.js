// Central export of query files
const ideasQueries = require("./ideas.queries");
const usersQueries = require("./users.queries");

module.exports = {
  ...ideasQueries,
  ...usersQueries,
};
