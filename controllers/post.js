const { validationResult } = require("express-validator");

const Post = require("../models/post");
const clearImage = require("../utils/clearImage");

exports.getPosts = function (req, res, next) {
  const currentUser = 10000;

  Post.find({ userId: currentUser })
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((err) => next(err));
};

exports.getPost = function (req, res, next) {
  const { postId } = req.params;

  Post.getPostById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post was found by id " + postId);
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json(post);
    })
    .catch((err) => next(err));
};

exports.createPost = function (req, res, next) {
  const validationErrors = validationResult(req);

  const mediaUrl = req.file && req.file.path;

  if (!validationErrors.isEmpty()) {
    const error = new Error("Validation failed, incorrect data");
    error.statusCode = 422;
    error.data = validationErrors.array();
    error.file = mediaUrl;
    throw error;
  }

  if (!mediaUrl) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const creatorId = req.body.creatorId;
  const description = req.body.description;

  const post = new Post(mediaUrl, creatorId, description);

  post
    .save()
    .then((newPost) => {
      return res.status(201).json(newPost);
    })
    .catch((err) => next({ ...err, file: mediaUrl }));
};

exports.deletePost = function (req, res, next) {
  const { postId } = req.params;
  let mediaUrl;

  Post.getPostById(postId)
    .then((post) => {
      mediaUrl = post.mediaUrl;

      return Post.deletePostById(postId);
    })
    .then(() => {
      clearImage(mediaUrl);
      res.status(200).json({ message: "Post was deleted" });
    })
    .catch((err) => next(err));
};

exports.addLike = function (req, res, next) {
  const { postId } = req.params;
  const userId = 10;

  Post.likePostById(postId, userId)
    .then((likes) => {
      return res.status(200).json({ likes });
    })
    .catch((err) => next(err));
};

exports.deleteLike = function (req, res, next) {
  const { postId } = req.params;
  const userId = 10;

  Post.dislikePostById(postId, userId)
    .then((likes) => {
      return res.status(200).json({ likes });
    })
    .catch((err) => next(err));
};
