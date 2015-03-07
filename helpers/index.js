var marked = require('marked');

// Markdown
marked.setOptions({sanitize: true});
exports.marked = marked;

// Image helpers
exports.imageUrl = function(model, size) {
  var tableName = model.Model.tableName;
  return '/assets/' + tableName + '/' + model.id + '/' + size + '.jpg';
};

// Users

exports.usersUrl = function() {
  return '/users';
};

exports.userEditUrl = function(user) {
  return '/users/' + user.id + '/edit';
};

exports.userImageUrl = function(user) {
  return '/users/' + user.id + '/image';
};

exports.userUrl = function(user) {
  return '/users/' + user.id;
};
