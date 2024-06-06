const { search } = require("./course-route");

module.exports = {
  auth: require("./auth"),
  course: require("./course-route"),
  search: require("./search"),
};
