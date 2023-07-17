const router = require("express").Router();

const postController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, postController.getPosts);

module.exports = router;
