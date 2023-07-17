const { validationResult } = require("express-validator");

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
  const password = req.body.password;

  const user = new User(username, email, password);

  user
    .save()
    .then((newUser) => {
      return res.status(201).json(newUser);
    })
    .catch((err) => next(err));
};
