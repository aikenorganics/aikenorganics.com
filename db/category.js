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

  get meat () {
    return !!this._meat
  }

  set meat (value) {
    this._meat = !!value
  }

  validate () {
    this.errors = {}

    if (!Number.isFinite(this.position)) {
      this.errors.position = ['Position must be a number.']
    }
  }

  toJSON () {
    return this.slice(
      'id',
      'meat',
      'name',
      'position',
      'removable'
    )
  }
}

module.exports = Category

const Product = require('./product')

Category.hasMany('products', {key: 'categoryId', model: Product})
