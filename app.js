const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(logger("dev"));
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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

  if (error.file) {
    fs.unlink(error.file, function () {});
  }

  res.status(status).json({ message, errors });
});

module.exports = app;
