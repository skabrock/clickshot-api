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

  static likePostById(id, userId) {
    return db
      .execute("INSERT INTO likes (userId, postId) VALUES (?,?)", [userId, id])
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [id]);
      })
      .then(([data]) => {
        return data.length;
      });
  }

  static dislikePostById(id, userId) {
    return db
      .execute("SELECT * FROM likes WHERE postId = ? AND userId = ? LIMIT 1", [
        id,
        userId,
      ])
      .then(([[{ id: likeId }]]) => {
        if (!likeId) {
          const error = new Error("No like was found");
          error.statusCode(404);
          throw error;
        }

        return db.execute("DELETE FROM likes WHERE id = ?", [likeId]);
      })
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [id]);
      })
      .then(([data]) => {
        return data.length;
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
}

module.exports = Post;
