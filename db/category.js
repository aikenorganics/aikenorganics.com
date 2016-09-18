'use strict'

const Model = require('./model')

class Category extends Model {

  static get tableName () {
    return 'categories'
  }

  static get columns () {
    return [
      'id',
      'meat',
      'name',
      'position',
      'createdAt',
      'updatedAt'
    ]
  }

  get name () {
    return this._name || ''
  }

  set name (value) {
    this._name = value || ''
  }

  get position () {
    return this._position || 0
  }

  set position (value) {
    this._position = value || 0
  }

  get meat () {
    return !!this._meat
  }

  set meat (value) {
    this._meat = !!value
  }

}

module.exports = Category

const Product = require('./product')

Category.hasMany('products', {key: 'categoryId', model: Product})
