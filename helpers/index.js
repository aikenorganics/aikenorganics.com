'use strict'

let marked = require('marked')
let moment = require('moment')

// Assets

let assetPath = exports.assetPath = function (path) {
  if (process.env.NODE_ENV !== 'production') return `/${path}`
  return require('../assets.json')[path]
}

// Markdown

marked.setOptions({sanitize: true})
exports.marked = marked

// Moment

exports.moment = moment

// Images

const IMAGES = [
  'img/vegetables-square.jpg',
  'img/veggies-in-boxes-square.jpg',
  'img/food-basket-square.jpg',
  'img/pen-and-pad-square.jpg'
].map(assetPath)

exports.imageUrl = function (model, size) {
  if (!model.image_updated_at) return IMAGES[model.id % IMAGES.length]
  let tableName = model.tableName

  return `/assets/${tableName}/${model.id}/${size}.${model.image_ext}?${+model.image_updated_at}`
}
