const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
// app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/posts", require("./routes/posts"));
app.use("/post", require("./routes/post"));
app.use("/", require("./routes/index"));

// ERROR HANDLING
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const errors = error.obj;
  res.status(status).json({ message, errors });
});

module.exports = app;
