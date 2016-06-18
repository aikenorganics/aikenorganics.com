'use strict'

const app = require('../../app')
const category = require('../../categories/category')

exports.edit = (json, locals) => {
  app(json, locals)
  json.set('category', locals.category)
}

exports.index = (json, locals) => {
  app(json, locals)
  json.set('categories', locals.categories, category)
}

exports.new = (json, locals) => {
  app(json, locals)
}
