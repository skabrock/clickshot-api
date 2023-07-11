const db = require("../db");

exports.addUser = function (req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;

  console.log([username, name, email, password, ""]);

  db.execute(
    "INSERT INTO users (username, name, email, password, imageUrl) VALUES (?,?,?,?,?)",
    [username, name, email, password, ""]
  )
    .then(() => {})
    .catch((err) => console.log(err));

  return res.send("test");
};
