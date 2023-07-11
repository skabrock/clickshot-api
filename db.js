const mysql = require("mysql2");

module.exports = mysql
  .createPool({
    host: "localhost",
    user: "root",
    database: "clickshot",
    password: process.env.MYSQL_PASSWORD,
  })
  .promise();
