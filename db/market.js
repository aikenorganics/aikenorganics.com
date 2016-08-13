'use strict'

let Model = require('./model')

class Market extends Model {

  static get tableName () {
    return 'markets'
  }

  static get columns () {
    return [
      'id',
      'open',
      'domain',
      'message',
      'created_at',
      'updated_at'
    ]
  }

}

module.exports = Market
