const router = require("express").Router();

const postController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, postController.getAllPosts);

module.exports = router;
