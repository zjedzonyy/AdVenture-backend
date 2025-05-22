const db = require("../../database/queries");

// Get the cookie and remove it from db
const removeSession = async (res) => {
  const authCookie = res.headers["set-cookie"];

  if (!authCookie) return;

  const sidCookie = authCookie.find((cookie) =>
    cookie.startsWith("connect.sid"),
  );

  const match = sidCookie?.match(/connect\.sid=s%3A([^.;]+)\./);
  const sid = match?.[1];

  if (sid) {
    await db.deleteSessionBySid(sid);
  }
};

module.exports = {
  removeSession,
};
