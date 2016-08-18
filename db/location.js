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

  get active () {
    return this.data.get('active') || false
  }

  set active (value) {
    this.data.set('active', value || false)
  }

}

module.exports = Location
