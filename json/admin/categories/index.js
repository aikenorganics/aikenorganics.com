'use strict'

const categoryJson = require('../../categories/category')

exports.create = (set, {category}) => {
  set('category', category, categoryJson)
}

exports.edit = (set, {category}) => {
  set('category', category, categoryJson)
}

exports.index = (set, {categories}) => {
  set('categories', categories, categoryJson)
}

exports.new = (set) => {}

exports.update = (set, {category}) => {
  set('category', category, categoryJson)
}
