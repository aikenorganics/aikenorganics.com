'use strict'

let db = require('./db')

class Location extends db.Model {

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

  update (values) {
    values.updatedAt = new Date()
    return super.update(values)
  }

}

module.exports = Location
