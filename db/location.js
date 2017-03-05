'use strict'

const Model = require('./model')

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
    return this._name || ''
  }

  set name (value) {
    this._name = value || ''
  }

  get active () {
    return this._active || false
  }

  set active (value) {
    this._active = value || false
  }

  toJSON () {
    return this.slice(
      'id',
      'name',
      'active',
      'removable'
    )
  }
}

module.exports = Location

const Order = require('./order')

Location.hasMany('orders', {key: 'locationId', model: Order})
