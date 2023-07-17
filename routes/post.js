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
  body("description").trim().escape().isLength({ min: "5", max: "500" }),
  postController.createPost
);

router.put(
  "/:postId",
  isAuth,
  upload.single("mediaUrl"),
  [
    body("mediaUrl").optional(),
    body("description")
      .trim()
      .optional()
      .escape()
      .isLength({ min: "5", max: "500" }),
  ],
  postController.updatePost
);

router.delete("/:postId", isAuth, postController.deletePost);

module.exports = router;
