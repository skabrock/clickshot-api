const db = require("../db");

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  save() {
    return db
      .execute(
        "INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?,?,?,?,?)",
        [
          this.username,
          this.email,
          this.password,
          this.createdAt,
          this.updatedAt,
        ]
      )
      .then(() => {
        return db.execute("SELECT * FROM users WHERE id = LAST_INSERT_ID()");
      })
      .then(([[data]]) => {
        return data;
      });
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
}

module.exports = User;
