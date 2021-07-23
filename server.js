const express = require("express");
const passport = require("passport");

// dot env import
const dotenv = require("dotenv");

// route
const postRoute = require("./routes/api/posts");
const profileRoute = require("./routes/api/profile");
const userRoute = require("./routes/api/users");

const app = express();

dotenv.config();

//database connection
const db = require("./db/db");

// passport middleware
app.use(passport.initialize());

// passport config
require("./middleware/passport")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing setup
app.use("/api/post", postRoute);
app.use("/api/profile", profileRoute);
app.use("/api/user", userRoute);

app.listen(process.env.PORT, () =>
  console.log(`server is running ${process.env.PORT}`)
);
