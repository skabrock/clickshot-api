const db = require("../db");

class Post {
  constructor(mediaUrl, creatorId, description) {
    this.mediaUrl = mediaUrl;
    this.creatorId = creatorId;
    this.description = description;
    this.createdAt = new Date();
  }

  save() {
    return db.execute(
      "INSERT INTO posts (mediaUrl, creatorId, description, createdAt) VALUES (?,?,?,?)",
      [this.mediaUrl, this.creatorId, this.description, this.createdAt]
    );
  }

  static fetchPosts(userId) {
    return db
      .execute("SELECT * FROM posts WHERE creatorId != ?", [userId])
      .then(([posts]) => {
        return new Promise((resolve) => {
          resolve(posts);
        });
      });
  }

  static fetchPost(postId) {
    const postQuery = db.execute("SELECT * FROM posts WHERE id = ?", [postId]);
    const commentsQuery = db.execute(
      "SELECT * FROM comments WHERE postId = ?",
      [postId]
    );
    const likesQuery = db.execute(
      "SELECT * FROM `post-likes` WHERE postId = ?",
      [postId]
    );

    return Promise.allSettled([postQuery, commentsQuery, likesQuery]).then(
      ([
        {
          value: [[post]],
        },
        {
          value: [comments],
        },
        {
          value: [likes],
        },
      ]) => {
        const newPost = { ...post, likes: likes.length, comments };

        return new Promise((resolve) => {
          resolve(newPost);
        });
      }
    );
  }
}

module.exports = Post;
