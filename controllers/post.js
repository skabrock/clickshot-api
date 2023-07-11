const Post = require("../models/post");

exports.getPosts = function (req, res, next) {
  const currentUser = 10000;

  Post.fetchPosts(currentUser)
    .then((posts) => {
      return res.send(posts);
    })
    .catch((err) => err);
};

exports.getPost = function (req, res, next) {
  const { postId } = req.params;

  Post.fetchPost(postId)
    .then((post) => {
      return res.send(post);
    })
    .catch((err) => err);
};

exports.addPost = function (req, res, next) {
  const mediaUrl = req.body.mediaUrl;
  const creatorId = req.body.creatorId;
  const description = req.body.description;

  const post = new Post(mediaUrl, creatorId, description);

  post
    .save()
    .then(() => {
      return res.send(post);
    })
    .catch((err) => console.log(err));
};
