const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
