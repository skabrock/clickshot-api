const mysql = require("mysql2");

module.exports = mysql
  .createPool({
    host: "localhost",
    user: "root",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  })
  .promise();
