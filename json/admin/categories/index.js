'use strict'

const app = require('../../app')
const categoryJson = require('../../categories/category')

exports.edit = (set, {category}) => {
  set(app)
  set('category', category, categoryJson)
}

exports.index = (set, {categories}) => {
  set(app)
  set('categories', categories, categoryJson)
}

exports.new = (set) => set(app)
