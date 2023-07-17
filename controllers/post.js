const { validationResult } = require("express-validator");

const Post = require("../models/post");
const clearImage = require("../utils/clearImage");

exports.getAllPosts = function (req, res, next) {
  const currentUser = req.userId;

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

  const creatorId = req.userId;
  const description = req.body.description;

  const post = new Post({ mediaUrl, creatorId, description });

  post
    .save()
    .then((newPost) => {
      return res
        .status(201)
        .json({ message: "Post created successfully!", post: newPost });
    })
    .catch((err) => next({ ...err, file: mediaUrl }));
};

exports.updatePost = function (req, res, next) {
  const {
    body: { description },
    params: { postId },
    file: { path: mediaUrl },
  } = req;

  let oldMediaUrl;

  Post.getPostById(postId)
    .then((post) => {
      if (String(post.creatorId) !== req.userId) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
      }

      oldMediaUrl = post.mediaUrl;

      if (!mediaUrl && (!description || post.description === description)) {
        const error = new Error("Nothing to update");
        error.statusCode = 400;
        throw error;
      }

      return Post.updatePostById(postId, { mediaUrl, description });
    })
    .then((updatedPost) => {
      if (mediaUrl) {
        clearImage(oldMediaUrl);
      }

      res
        .status(200)
        .json({ message: "Post was successfully updated", post: updatedPost });
    })
    .catch((err) => next(err));
};

exports.deletePost = function (req, res, next) {
  let mediaUrl;

  Post.getPostById(req.params.postId)
    .then((post) => {
      mediaUrl = post.mediaUrl;

      if (post.creatorId !== req.userId) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
      }

      return Post.deletePostById(postId);
    })
    .then(() => {
      clearImage(mediaUrl);
      res.status(200).json({ message: "Post was successfully deleted" });
    })
    .catch((err) => next(err));
};

exports.addLike = function (req, res, next) {
  Post.likePostById(req.params.postId, req.userId)
    .then((likes) => {
      return res.status(200).json({ likes });
    })
    .catch((err) => next(err));
};

exports.deleteLike = function (req, res, next) {
  Post.dislikePostById(req.params.postId, req.userId)
    .then((likes) => {
      return res.status(200).json({ likes });
    })
    .catch((err) => next(err));
};
