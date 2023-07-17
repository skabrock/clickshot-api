const router = require("express").Router();
const { body, oneOf } = require("express-validator");

const userController = require("../controllers/user");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const upload = require("../utils/fileStorage");

router.put(
  "/",
  isAuth,
  upload.single("mediaUrl"),
  oneOf([
    body("fullName").trim().isAlpha().isLength({ min: 8, max: 45 }),
    body("name").trim().isAlpha().isLength({ min: 8, max: 45 }),
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
    body("description").trim().not().isEmpty().isLength({ max: 500 }),
  ]),
  userController.update
);

module.exports = router;
