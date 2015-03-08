var marked = require('marked');
var models = require('../models');

// Markdown
marked.setOptions({sanitize: true});
exports.marked = marked;

// Images

var IMAGES = [
  '/img/vegetables-square.jpg',
  '/img/veggies-in-boxes-square.jpg',
  '/img/food-basket-square.jpg',
  '/img/pen-and-pad-square.jpg'
];

// Image helpers
exports.imageUrl = function(model, size) {
  if (!model.imaged_at) return IMAGES[model.id % IMAGES.length];

  var tableName = model.Model.tableName;

  return [
    '/assets',
    tableName,
    model.id,
    size + '.jpg?' + +model.imaged_at
  ].join('/');
};

[
  models.User,
  models.Grower,
  models.Product
].forEach(function(Model) {

  var tableName = Model.tableName;

  exports[tableName + 'Url'] = function() {
    return '/' + tableName;
  };

  exports[tableName.slice(0, -1) + 'Url'] = function(model) {
    return '/' + tableName + '/' + model.id;
  };

  exports[tableName.slice(0, -1) + 'EditUrl'] = function(model) {
    return '/' + tableName + '/' + model.id + '/edit';
  };

  exports[tableName.slice(0, -1) + 'ImageUrl'] = function(model) {
    return '/' + tableName + '/' + model.id + '/image';
  };

});
