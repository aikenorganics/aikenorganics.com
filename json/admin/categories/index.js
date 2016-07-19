'use strict'

const categoryJson = require('../../categories/category')

exports.edit = (set, {category}) => {
  set('category', category, categoryJson)
}

exports.index = (set, {categories}) => {
  set('categories', categories, categoryJson)
}

exports.new = (set) => {}
