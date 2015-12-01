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

}

module.exports = Location
