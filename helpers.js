var marked = require('marked');

// Markdown
marked.setOptions({sanitize: true});
exports.marked = marked;

// Image helpers
exports.imageUrl = function(model, size) {
  var tableName = model.Model.tableName;
  return '/assets/' + tableName + '/' + model.id + '/' + size + '.jpg';
};
