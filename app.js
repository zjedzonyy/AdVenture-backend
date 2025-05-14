const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("./database/pool.js");
const passport = require("passport");

require("dotenv").config();
require("./config/passport.config.js");

// Routes
const authRouter = require("./routes/authRoutes.js");

const app = express();
const PORT = process.env.PORT || "3000";

// Use "public" folder for static files
app.use(express.static("public"));
// Allows reading data from HTML forms
app.use(express.urlencoded({ extended: true }));
// Allows reading JSON from requests
app.use(express.json());

// Allows for requests from:
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Configurate sessions
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json("Hello, it worked!");
});

// Use routes
app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server started on port:`, PORT));
