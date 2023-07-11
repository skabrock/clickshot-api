const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const router = require("./routes/index");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

module.exports = app;
