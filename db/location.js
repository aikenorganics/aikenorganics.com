'use strict'

let Model = require('./model')

class Location extends Model {

  static get tableName () {
    return 'locations'
  }

  static get columns () {
    return [
      'id',
      'name',
      'active',
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

  get active () {
    return this.data.get('active') || false
  }

  set active (value) {
    this.data.set('active', value || false)
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      active: this.active
    }
  }

}

module.exports = Location
