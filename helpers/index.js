'use strict'

const marked = require('marked')
const moment = require('moment')
const assets = require('ozymandias/assets')

// Assets

exports.assetPath = assets.path

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
].map(assets.path)

exports.imageUrl = function (model, size) {
  if (!model.image_updated_at) return IMAGES[model.id % IMAGES.length]
  let tableName = model.tableName
  return `/assets/${tableName}/${model.id}/image/${size}.${model.image_ext}?${+model.image_updated_at}`
}
