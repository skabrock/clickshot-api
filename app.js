const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

const clearImage = require("./utils/clearImage");

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
app.use("/auth", require("./routes/auth"));
app.use("*", require("./routes/404"));

// ERROR HANDLING
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const errors = error.data;

  if (error.file) {
    clearImage(error.file);
  }

  res.status(status).json({ message, errors });
});

module.exports = app;
