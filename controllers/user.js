const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = function (req, res, next) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const error = new Error("Validation failed, incorrect data");
    error.statusCode = 422;
    error.data = validationErrors.array();

    throw error;
  }

  const username = req.body.username;
  const email = req.body.email;

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const user = new User({ username, email, password: hashedPassword });

      return user.save();
    })
    .then((newUser) => {
      delete newUser.password;

      return res.status(201).json(newUser);
    })
    .catch((err) => next(err));
};

exports.login = function (req, res, next) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const error = new Error("Validation failed, incorrect data");
    error.statusCode = 422;
    error.data = validationErrors.array();

    throw error;
  }

  const login = req.body.login;
  const password = req.body.password;
  let loadedUser;

  function throwAuthError() {
    const error = new Error("Wrong login/password combination");
    error.statusCode = 401;

    throw error;
  }

  User.findByLogin(login)
    .then((user) => {
      if (!user) {
        throwAuthError();
      }

      loadedUser = { ...user, password: undefined };

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throwAuthError();
      }

      const token = jwt.sign(
        { email: loadedUser.email, userId: String(loadedUser.id) },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({ token, user: loadedUser });
    })
    .catch((err) => next(err));
};
