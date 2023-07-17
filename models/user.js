const db = require("../db");

class User {
  constructor({
    id,
    mediaUrl,
    description,
    createdAt,
    username,
    fullName,
    email,
    password,
  }) {
    this.id = id;
    this.mediaUrl = mediaUrl || null;
    this.description = description || null;
    this.username = username;
    this.fullName = fullName || null;
    this.email = email;
    this.hashedPW = password;
    this.updatedAt = new Date();
    this.createdAt = createdAt || this.updatedAt;
  }

  #create() {
    return db
      .execute(
        "INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?,?,?,?,?)",
        [
          this.username,
          this.email,
          this.hashedPW,
          this.createdAt,
          this.updatedAt,
        ]
      )
      .then(() => {
        return db.execute("SELECT LAST_INSERT_ID()");
      })
      .then(([[id]]) => {
        this.id = Object.values(id);

        return this;
      });
  }

  #update() {
    return db
      .execute(
        "UPDATE users SET mediaUrl = ?, description = ?, username = ?, fullName = ?, email = ?, password = ?, updatedAt = ? WHERE id = ? LIMIT 1",
        [
          this.mediaUrl,
          this.description,
          this.username,
          this.fullName,
          this.email,
          this.hashedPW,
          this.updatedAt,
          this.id,
        ]
      )
      .then(() => {
        return this;
      });
  }

  get getPublicData() {
    return {
      id: this.id,
      mediaUrl: this.mediaUrl,
      description: this.description,
      username: this.username,
      email: this.email,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }

  save() {
    if (this.id) {
      return this.#update();
    }

    return this.#create();
  }

  static isUniqEmail(email) {
    return db
      .execute("SELECT EXISTS(SELECT * FROM users WHERE email = ? LIMIT 1)", [
        email,
      ])
      .then(([[data]]) => {
        return Object.values(data)[0];
      });
  }

  static isUniqUserName(username) {
    return db
      .execute(
        "SELECT EXISTS(SELECT * FROM users WHERE username = ? LIMIT 1)",
        [username]
      )
      .then(([[data]]) => {
        return Object.values(data)[0];
      });
  }

  static find(id) {
    return db
      .execute("SELECT * FROM users WHERE id = ? LIMIT 1", [id])
      .then(([[user]]) => {
        if (!user) {
          const error = new Error("Failed to update user, user doesn't exist");
          throw error;
        }

        return user;
      });
  }

  // find by email of username
  static findByLogin(login) {
    return db
      .execute("SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1", [
        login,
        login,
      ])
      .then(([[data]]) => {
        return data;
      });
  }
}

module.exports = User;
