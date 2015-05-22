var marked = require('marked')

// Markdown

marked.setOptions({sanitize: true})
exports.marked = marked

// Images

var IMAGES = [
  '/img/vegetables-square.jpg',
  '/img/veggies-in-boxes-square.jpg',
  '/img/food-basket-square.jpg',
  '/img/pen-and-pad-square.jpg'
]

exports.imageUrl = function (model, size) {
  if (!model.imaged_at) return IMAGES[model.id % IMAGES.length]

  var tableName = model.Model.tableName

  return [
    '/assets',
    tableName,
    model.id,
    size + '.jpg?' + +model.imaged_at
  ].join('/')
}
