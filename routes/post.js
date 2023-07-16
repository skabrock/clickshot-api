const router = require("express").Router();
const { body } = require("express-validator");

const postController = require("../controllers/post");
const upload = require("../utils/fileStorage");

router.patch("/like/:postId", postController.addLike);

router.patch("/dislike/:postId", postController.deleteLike);

router.get("/:postId", postController.getPost);

router.post(
  "/",
  upload.single("mediaUrl"),
  body("description").trim().isLength({ min: "5", max: "500" }),
  postController.createPost
);

router.delete("/:postId", postController.deletePost);

module.exports = router;
