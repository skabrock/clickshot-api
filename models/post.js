const db = require("../db");

class Post {
  constructor({ mediaUrl, creatorId, description }) {
    this.mediaUrl = mediaUrl;
    this.creatorId = creatorId;
    this.description = description;
    this.createdAt = new Date();
  }

  save() {
    return db
      .execute(
        "INSERT INTO posts (mediaUrl, creatorId, description, createdAt) VALUES (?,?,?,?)",
        [this.mediaUrl, this.creatorId, this.description, this.createdAt]
      )
      .then(() => {
        return db.execute("SELECT * FROM posts WHERE id = LAST_INSERT_ID()");
      })
      .then(([[data]]) => {
        return data;
      });
  }

  static find({ userId }) {
    return db
      .execute("SELECT * FROM posts WHERE creatorId != ?", [userId])
      .then(([posts]) => {
        return posts;
      });
  }

  static getPostById(id) {
    const postQuery = db.execute("SELECT * FROM posts WHERE id = ?", [id]);
    const commentsQuery = db.execute(
      "SELECT * FROM comments WHERE postId = ?",
      [id]
    );
    const likesQuery = db.execute("SELECT * FROM likes WHERE postId = ?", [id]);

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
        if (!post) {
          const error = new Error("No post was found");
          error.statusCode(404);
          throw error;
        }

        const newPost = { ...post, likes: likes.length, comments };

        return new Promise((resolve) => {
          resolve(newPost);
        });
      }
    );
  }

  static updatePostById(id, { mediaUrl, description }) {
    let newMediaUrl, newDescription;

    db.execute("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]).then(
      ([[post]]) => {
        if (!post) {
          throw new Error("No post was found");
        }

        newMediaUrl = mediaUrl || post.mediaUrl;
        newDescription = description || post.description;

        return db
          .execute(
            "UPDATE posts SET mediaUrl = ?, description = ? WHERE id = ? LIMIT 1",
            [newMediaUrl, newDescription, id]
          )
          .then(() => {
            return db.execute("SELECT * FROM posts WHERE id != ? LIMIT 1", [
              id,
            ]);
          })
          .then(([[post]]) => {
            return post;
          });
      }
    );
  }

  static deletePostById(id) {
    return db.execute("DELETE FROM posts WHERE id = ?", [id]);
  }

  static likePost(postId, userId) {
    return db
      .execute("SELECT * FROM likes WHERE postId = ? AND userId = ? LIMIT 1", [
        postId,
        userId,
      ])
      .then(([[like]]) => {
        if (like) {
          const error = new Error("Post already liked");
          error.statusCode = 404;
          throw error;
        }

        return db.execute("INSERT INTO likes (userId, postId) VALUES (?,?)", [
          userId,
          postId,
        ]);
      })
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [postId]);
      })
      .then(([data]) => {
        return data.length;
      });
  }

  static dislikePost(postId, userId) {
    return db
      .execute("SELECT * FROM likes WHERE postId = ? AND userId = ? LIMIT 1", [
        postId,
        userId,
      ])
      .then(([[like]]) => {
        if (!like) {
          const error = new Error("No like was found");
          error.statusCode = 404;
          throw error;
        }

        return db.execute(
          "DELETE FROM likes WHERE userId = ? AND postID = ? LIMIT 1",
          [userId, postId]
        );
      })
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [postId]);
      })
      .then(([data]) => {
        return data.length;
      });
  }

  static savePost(postId, userId) {
    return db
      .execute(
        "SELECT * FROM `post-saves` WHERE postId = ? AND userId = ? LIMIT 1",
        [postId, userId]
      )
      .then(([[saved]]) => {
        if (saved) {
          const error = new Error("Post already saved");
          error.statusCode = 404;
          throw error;
        }

        return db.execute(
          "INSERT INTO `post-saves` (userId, postId) VALUES (?,?)",
          [userId, postId]
        );
      });
  }

  static removePostFromSave(postId, userId) {
    return db
      .execute(
        "SELECT * FROM `post-saves` WHERE postId = ? AND userId = ? LIMIT 1",
        [postId, userId]
      )
      .then(([[saved]]) => {
        if (!saved) {
          const error = new Error("Post hasn't been saved yet");
          error.statusCode = 404;
          throw error;
        }

        return db.execute(
          "DELETE FROM `post-saves` WHERE userId = ? AND postID = ? LIMIT 1",
          [userId, postId]
        );
      });
  }
}

module.exports = Post;
