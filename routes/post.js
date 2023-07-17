const router = require("express").Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const postController = require("../controllers/post");
const upload = require("../utils/fileStorage");

router.patch("/like/:postId", isAuth, postController.addLike);

router.patch("/dislike/:postId", isAuth, postController.deleteLike);

router.get("/:postId", isAuth, postController.getPost);

router.post(
  "/",
  isAuth,
  upload.single("mediaUrl"),
  body("description").trim().isLength({ min: "5", max: "500" }),
  postController.createPost
);

router.delete("/:postId", postController.deletePost);

module.exports = router;
