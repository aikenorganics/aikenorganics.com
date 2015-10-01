'use strict'

let marked = require('marked')
let assets = require('../assets.json')

// Assets

let assetPath = exports.assetPath = function (path) {
  return assets[path]
}

// Markdown

marked.setOptions({sanitize: true})
exports.marked = marked

// Images

const IMAGES = [
  'img/vegetables-square.jpg',
  'img/veggies-in-boxes-square.jpg',
  'img/food-basket-square.jpg',
  'img/pen-and-pad-square.jpg'
].map(assetPath)

exports.imageUrl = function (model, size) {
  if (!model.imaged_at) return IMAGES[model.id % IMAGES.length]
  let tableName = model.tableName

  return `/assets/${tableName}/${model.id}/${size}.jpg?${+model.imaged_at}`
}
