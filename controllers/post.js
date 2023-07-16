const { validationResult } = require("express-validator");

const Post = require("../models/post");

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

exports.addPost = function (req, res, next) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const error = new Error("Validation failed, incorrect data");
    error.statusCode = 422;
    error.obj = validationErrors.array();
    throw error;
  }

  const creatorId = req.body.creatorId;
  const mediaUrl = req.body.mediaUrl;
  const description = req.body.description;

  const post = new Post(mediaUrl, creatorId, description);

  post
    .save()
    .then((newPost) => {
      return res.status(201).json(newPost);
    })
    .catch((err) => next(err));
};

exports.addLike = function (req, res, next) {
  const { postId } = req.params;
  const userId = 10;

  Post.likePostById(postId, userId).then((likes) => {
    return res.status(200).json({ likes });
  });
  // .catch((err) => res.send(err));
};

exports.deleteLike = function (req, res, next) {
  const { postId } = req.params;
  const userId = 10;

  Post.dislikePostById(postId, userId).then((likes) => {
    return res.status(200).json({ likes });
  });
  // .catch((err) => res.send(err));
};
