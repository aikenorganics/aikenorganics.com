'use strict'

let Model = require('./model')

class Location extends Model {

  static get tableName () {
    return 'locations'
  }

  static get columns () {
    return [
      {name: 'id'},
      {name: 'name'},
      {name: 'created_at', property: 'createdAt'},
      {name: 'updated_at', property: 'updatedAt'}
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
