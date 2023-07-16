const router = require("express").Router();
const { body } = require("express-validator");

const postController = require("../controllers/post");

router.patch("/like/:postId", postController.addLike);

router.patch("/dislike/:postId", postController.deleteLike);

router.get("/:postId", postController.getPost);

router.post(
  "/",
  [
    // body("mediaUrl"),
    body("description").trim().isLength({ min: "5", max: "500" }),
  ],
  postController.addPost
);

module.exports = router;
