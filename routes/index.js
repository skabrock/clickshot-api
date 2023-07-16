const router = require("express").Router();

// const postController = require("../controllers/post");
// const userController = require("../controllers/user");

// router.post("/registration", userController.addUser);

router.use("*", function (req, res, next) {
  res.send("404");
});

module.exports = router;
