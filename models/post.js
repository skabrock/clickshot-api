const db = require("../db");

class Post {
  constructor(mediaUrl, creatorId, description) {
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
        return db
          .execute("SELECT * FROM posts WHERE id = LAST_INSERT_ID()")
          .then(([data]) => {
            return new Promise((resolve) => {
              resolve(data);
            });
          });
      });
  }

  static likePostById(id, userId) {
    return db
      .execute("INSERT INTO likes (userId, postId) VALUES (?,?)", [userId, id])
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [id]);
      })
      .then(([data]) => {
        return new Promise((resolve) => {
          resolve(data.length);
        });
      });
  }

  static dislikePostById(id, userId) {
    return db
      .execute("SELECT * FROM likes WHERE postId = ? AND userId = ?", [
        id,
        userId,
      ])
      .then((data) => {
        const likeId = data[0]?.[0]?.id;
        if (likeId) {
          return db.execute("DELETE FROM likes WHERE id = ?", [likeId]);
        }

        return;
      })
      .then(() => {
        return db.execute("SELECT * FROM likes WHERE postId = ?", [id]);
      })
      .then(([data]) => {
        return new Promise((resolve) => {
          resolve(data.length);
        });
      });
  }

  static find({ userId }) {
    return db
      .execute("SELECT * FROM posts WHERE creatorId != ?", [userId])
      .then(([posts]) => {
        return new Promise((resolve) => {
          resolve(posts);
        });
      });
  }

  static find({ userId }) {
    return db
      .execute("SELECT * FROM posts WHERE creatorId != ?", [userId])
      .then(([posts]) => {
        return new Promise((resolve) => {
          resolve(posts);
        });
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
          throw new Error("No post was found");
        }

        const newPost = { ...post, likes: likes.length, comments };

        return new Promise((resolve) => {
          resolve(newPost);
        });
      }
    );
  }

  static deletePostById(id) {
    return db.execute("DELETE FROM posts WHERE id = ?", [id]);
  }
}

module.exports = Post;
