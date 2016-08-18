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
    return this.data.get('name') || ''
  }

  set name (value) {
    this.data.set('name', value || '')
  }

  get position () {
    return this.data.get('position') || 0
  }

  set position (value) {
    this.data.set('position', value || 0)
  }

  get meat () {
    return !!this.data.get('meat')
  }

  set meat (value) {
    this.data.set('meat', !!value)
  }

}

module.exports = Category
