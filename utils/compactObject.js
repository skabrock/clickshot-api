module.exports = function (obj) {
  return Object.entries(obj)
    .filter(([key, value]) => value !== undefined)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
