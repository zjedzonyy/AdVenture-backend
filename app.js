const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const morgan = require("morgan");
const { Pool } = require("pg");

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("./utils/error.utils.js");

require("dotenv-flow").config();
require("./config/passport.config.js");

// Routes
const authRouter = require("./routes/auth.route.js");
const usersRouter = require("./routes/user.route.js");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Use "public" folder for static files
app.use(express.static("public"));
// Allows reading data from HTML forms
app.use(express.urlencoded({ extended: true }));
// Allows reading JSON from requests
app.use(express.json());

// Logging middleware
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Allows for requests from:
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Configurate sessions
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json("Hello, it worked!");
});

// Use routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ name: err.name, message: err.message });
});

module.exports = app;
