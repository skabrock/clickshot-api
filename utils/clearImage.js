const fs = require("fs");

module.exports = function (path, cb) {
  const callback = cb || function () {};
  fs.unlink(path, callback);
};
