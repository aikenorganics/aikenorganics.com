'use strict'

let Model = require('./model')

class Category extends Model {

  static get tableName () {
    return 'categories'
  }

  static get columns () {
    return [
      'id',
      'name',
      'position',
      'created_at',
      'updated_at'
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

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }

}

module.exports = Category
