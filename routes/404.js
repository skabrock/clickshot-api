const router = require("express").Router();

router.use("*", function (req, res, next) {
  res.send("404");
});

module.exports = router;
