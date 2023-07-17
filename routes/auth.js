const router = require("express").Router();
const { body, oneOf } = require("express-validator");

const userController = require("../controllers/user");
const User = require("../models/user");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.isUniqEmail(value).then((matches) => {
          if (matches) {
            return Promise.reject("email address is already exist");
          }
        });
      }),
    body("username")
      .trim()
      .isLength({ min: 3, max: 45 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        return User.isUniqUserName(value).then((matches) => {
          if (matches) {
            return Promise.reject("username is already exist");
          }
        });
      }),
    body("password")
      .trim()
      .isStrongPassword()
      .withMessage("please use stronger password"),
  ],
  userController.createUser
);

router.post(
  "/login",
  [
    oneOf([
      body("login").trim().isAlphanumeric().isLength({ min: 3, max: 45 }),
      body("login").isEmail(),
    ]),
    body("password").trim().isLength({ min: 8, max: 100 }),
  ],
  userController.login
);

module.exports = router;
